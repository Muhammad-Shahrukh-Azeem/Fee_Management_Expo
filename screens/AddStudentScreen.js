import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import { db } from '../firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import PackageCard from '../components/PackageCard';

const AddStudentScreen = () => {
    const [name, setName] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState({});
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedPackages, setSelectedPackages] = useState([]);

    const calculatePrices = () => {
        let total = 0;

        if (selectedPackage) {
            const packageData = packages.find(pkg => pkg.id === selectedPackage);
            if (packageData) {
                total = packageData.amount;
            }
        }

        const selectedSubjectCount = Object.values(selectedSubjects).filter(value => value).length;
        total += selectedSubjectCount * 100; // Assuming each subject costs 100.

        setTotalPrice(total);
    };



    const navigation = useNavigation();
    useEffect(() => {
        fetchPackages();
        fetchSubjects();
    }, []);
    useEffect(() => {
        calculatePrices();
    }, [selectedSubjects, selectedPackage]);


    const fetchSubjects = async () => {
        try {
            const subjectSnapshot = await getDocs(collection(db, 'courses'));
            console.log('Subject data from Firestore:', subjectSnapshot.docs.map(doc => doc.data()));
            const fetchedSubjects = subjectSnapshot.docs.map(doc => ({
                name: doc.data().subjectName,
                cost: doc.data().subjectFee // assuming the cost field is named 'subjectCost' in Firestore
            }));
            setSubjects(fetchedSubjects);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };
    
    const handleSubmit = async () => {
        if (!name) {
          alert('Please fill in all fields');
          return;
        }
      
        try {
          const totalAmount = calculateTotal();
          const studentData = {
            name,
            packages: selectedPackages.map(pkgId => ({
              packageName: packages.find(pkg => pkg.id === pkgId)?.packageName || '',
            })),
            subjects: Object.keys(selectedSubjects).filter(
              subject => selectedSubjects[subject],
            ),
            totalFee: totalAmount,
          };
          
      
          await addDoc(collection(db, 'studentData'), studentData);
          alert('Student added successfully');
          navigation.navigate('Home', { studentData });
        } catch (error) {
          console.error('Error adding student:', error);
          alert('Failed to add student');
        }
    };

    const handlePackageSelection = (selectedPkg) => {
        // Toggle the package selection
        if (selectedPackages.includes(selectedPkg.id)) {
            setSelectedPackages(selectedPackages.filter(pkgId => pkgId !== selectedPkg.id));
        } else {
            setSelectedPackages([...selectedPackages, selectedPkg.id]);
        }
    };

      
    const fetchPackages = async () => {
        try {
            const packageSnapshot = await getDocs(collection(db, 'packages'));
            if (packageSnapshot && packageSnapshot.docs) {
                const fetchedPackages = packageSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        amount: data.Amount,
                        packageName: data.Package,
                        subjects: data.Subjects,
                        status: "Unpaid",
                    };
                });
                setPackages(fetchedPackages);
            } else {
                console.error('Invalid package data received from Firestore:', packageSnapshot);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching packages:', error);
            setLoading(false);
        }
    };





    const handleSubjectSelection = (subject, isSelected) => {
        setSelectedSubjects({ ...selectedSubjects, [subject]: isSelected });
    }

    const renderSubject = ({ item }) => {
        const subject = item.name;
        const cost = item.cost;
    
        return (
            <View style={styles.subjectCheckboxContainer} key={subject}>
                <RadioButton
                    value={selectedSubjects[subject]}
                    status={selectedSubjects[subject] ? 'checked' : 'unchecked'}
                    onPress={() => handleSubjectSelection(subject, !selectedSubjects[subject])}
                />
                <Text style={styles.subjectLabel}>
                    {subject.charAt(0).toUpperCase() + subject.slice(1)} ({cost})
                </Text>
            </View>
        );
    };
    
    
    const calculateTotal = () => {
        const selectedPackageAmount = selectedPackages
          .map((pkgId) => packages.find((pkg) => pkg.id === pkgId)?.amount || 0)
          .reduce((total, amount) => total + amount, 0);
      
        const selectedSubjectCosts = Object.keys(selectedSubjects)
          .filter((subject) => selectedSubjects[subject])
          .map((subject) => subjects.find((s) => s.name === subject)?.cost || 0)
          .reduce((total, cost) => total + cost, 0);
      
        return selectedPackageAmount + selectedSubjectCosts;
      };
      


    const renderPackage = ({ item }) => (
        <View key={item.id} style={styles.packageContainer}>
            <PackageCard
                packageName={item.packageName}
                subjects={item.subjects}
                amount={item.amount}
                onPress={() => handlePackageSelection(item)}
            />
            <RadioButton
                value={item.id}
                status={selectedPackages.includes(item.id) ? 'checked' : 'unchecked'}
                onPress={() => handlePackageSelection(item)}
            />
        </View>
    );
    

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Add Student</Text>
            <TextInput
                placeholder="Student Name"
                value={name}
                onChangeText={(text) => setName(text)}
                style={styles.input}
            />
            <Text style={styles.subjectsHeading}>Subjects</Text>
            <FlatList
                data={subjects}
                renderItem={renderSubject}
                keyExtractor={(item) => item}
                numColumns={2}
                contentContainerStyle={styles.subjectsContainer}
            />
            <Text style={styles.packagesHeading}>Packages</Text>
            <FlatList
                data={packages}
                renderItem={renderPackage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.packagesContainer}
            />
            <Text style={styles.totalCost}>Total Cost: ${calculateTotal()}</Text>

            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Add Student</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddStudentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#0782F9',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    subjectsHeading: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    subjectsContainer: {
        marginBottom: 20,
    },
    subjectCheckboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        marginBottom: 15,
        flexBasis: '48%',
    },
    subjectLabel: {
        marginLeft: 8,
    },
    packagesHeading: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    packagesContainer: {
        marginBottom: 20,
    },
    packageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#0782F9',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    packagesHeading: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    packagesContainer: {
        marginBottom: 20,
    },
    totalCost: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 20,
    },

});
