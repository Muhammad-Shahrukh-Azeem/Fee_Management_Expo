import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

const subjectFees = {
    maths: 100,
    english: 80,
    pst: 90,
    chemistry: 100,
    physics: 100,
    computer: 100,
    urdu: 80,
    isl: 80,
};

const AddStudentScreen = () => {
    const [name, setName] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState({});
    const [totalFee, setTotalFee] = useState(0);

    const navigation = useNavigation();

    const handleSubjectSelection = (subject, value) => {
        setSelectedSubjects((prevSelectedSubjects) => {
            const updatedSelection = { ...prevSelectedSubjects, [subject]: value };
            setTotalFee(Object.entries(updatedSelection).reduce((acc, [key, isSelected]) => {
                return isSelected ? acc + subjectFees[key] : acc;
            }, 0));
            return updatedSelection;
        });
    };

    const handleSubmit = async () => {
        if (name.trim() === '') {
            alert('Please enter the student name.');
            return;
        }

        const selectedSubjectList = Object.entries(selectedSubjects).filter(([_, isSelected]) => isSelected).map(([subject, _]) => subject);

        if (selectedSubjectList.length === 0) {
            alert('Please select at least one subject.');
            return;
        }

        try {
            await addDoc(collection(db, 'studentData'), {
                name,
                subjects: selectedSubjectList,
                totalFee,
                status: 'Unpaid',
            });

            alert('Student added successfully.');
            navigation.goBack();
        } catch (error) {
            alert('Error adding student: ' + error.message);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Add Student</Text>
            <TextInput
                placeholder="Student Name"
                value={name}
                onChangeText={text => setName(text)}
                style={styles.input}
            />
            <Text style={styles.subjectsHeading}>Subjects</Text>
            <View style={styles.subjectsContainer}>
                {Object.keys(subjectFees).map((subject) => (
                    <View style={styles.subjectCheckboxContainer} key={subject}>
                        <RadioButton
                            value={selectedSubjects[subject]}
                            status={selectedSubjects[subject] ? 'checked' : 'unchecked'}
                            onPress={() => handleSubjectSelection(subject, !selectedSubjects[subject])}
                        />
                        <Text style={styles.subjectLabel}>{subject.charAt(0).toUpperCase() + subject.slice(1)}</Text>
                    </View>
                ))}
            </View>
            <Text style={styles.totalFee}>Total Fee: {totalFee}</Text>
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Add Student</Text>
            </TouchableOpacity>
        </ScrollView>
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    subjectCheckboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        marginBottom: 15,
    },
    subjectLabel: {
        marginLeft: 8,
    },
    totalFee: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 20,
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
});