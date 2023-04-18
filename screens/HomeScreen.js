import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
} from 'firebase/firestore';
import StudentCard from '../components/StudentCard';
import { Picker } from '@react-native-picker/picker';
import UserRoleContext from '../contexts/UserRoleContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const { userRole } = useContext(UserRoleContext);
  const [branch, setBranch] = useState(
    userRole === 'Admin' ? 'Model' : userRole
  );

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const months = Array.from(
    { length: selectedYear === currentYear ? currentMonth : 12 },
    (_, i) => i + 1
  );
  const years = Array.from(
    { length: currentYear - 2023 + 1 },
    (_, i) => 2023 + i
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'studentData'), where('branch', '==', branch)),
      (snapshot) => {
        const fetchedStudents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(fetchedStudents);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [branch]);

  useEffect(() => {
    if (students.length === 0 || feeRecords.length === 0) {
      setFilteredStudents([]);
      return;
    }

    const filterStudents = () => {
      return students.filter((student) => {
        const studentFeeRecord = feeRecords.find(
          (record) => record.studentId === student.id
        );

        if (!studentFeeRecord) {
          return false;
        }

        if (filter === 'All') {
          return true;
        } else {
          return studentFeeRecord.status === filter;
        }
      });
    };

    setFilteredStudents(filterStudents());
  }, [filter, students, feeRecords]);

  useEffect(() => {
    if (students.length === 0 || feeRecords.length === 0) {
      setFilteredStudents([]);
      return;
    }

    const filterStudents = () => {
      let filtered = students.filter((student) => {
        const studentFeeRecord = feeRecords.find(
          (record) => record.studentId === student.id
        );

        if (!studentFeeRecord) {
          return false;
        }

        if (filter === 'All') {
          return true;
        } else {
          return studentFeeRecord.status === filter;
        }
      });

      // Apply search filter
      filtered = searchStudents(filtered);

      return filtered;
    };

    setFilteredStudents(filterStudents());
  }, [filter, students, feeRecords, searchText]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'feeRecords'),
        where('month', '==', selectedMonth),
        where('year', '==', selectedYear)
      ),
      (snapshot) => {
        const fetchedFeeRecords = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeeRecords(fetchedFeeRecords);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedMonth, selectedYear, currentMonth, currentYear]);

  useEffect(() => {
    const checkAndInitializeFeeRecords = async () => {
      const feeRecordSnapshot = await getDocs(
        query(
          collection(db, 'feeRecords'),
          where('month', '==', selectedMonth),
          where('year', '==', selectedYear)
        )
      );

      if (feeRecordSnapshot.empty) {
        await initializeFeeRecordsForMonth(selectedMonth, selectedYear);
      }
    };

    if (students.length > 0) {
      checkAndInitializeFeeRecords();
    }
  }, [selectedMonth, selectedYear, students]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };
  const BranchPicker = () => {
    if (userRole === 'Admin') {
      return (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={branch}
            style={styles.picker}
            onValueChange={(itemValue) => setBranch(itemValue)}
          >
            <Picker.Item label="Model" value="Model" />
            <Picker.Item label="Johar" value="Johar" />
          </Picker>
        </View>
      );
    }
    return null;
  };

  const searchStudents = (studentsList) => {
    if (searchText === '') {
      return studentsList;
    }

    return studentsList.filter((student) =>
      student.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const initializeFeeRecordsForMonth = async (month, year) => {
    const studentDocs = await getDocs(collection(db, 'studentData'));

    const batch = writeBatch(db);

    studentDocs.forEach((studentDoc) => {
      const studentData = studentDoc.data();
      const monthName = new Date(2000, month - 1).toLocaleString('default', {
        month: 'long',
      });

      const feeRecordRef = doc(
        db,
        'feeRecords',
        `${studentDoc.id}_${month}_${year}`
      );
      batch.set(feeRecordRef, {
        studentId: studentDoc.id,
        studentName: studentData.name,
        month: month,
        monthName: monthName,
        year: year,
        status: 'Unpaid',
        totalFee: studentData.totalFee,
        subjects: studentData.subjects, // Add this line
        packages: studentData.packages, // Add this line
      });
    });

    await batch.commit();
  };

  const MonthPicker = () => (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedMonth}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedMonth(itemValue)}
      >
        {months.map((month) => {
          const monthName = new Date(2000, month - 1).toLocaleString(
            'default',
            { month: 'long' }
          );
          const shortMonthName = monthName.slice(0, 5); // Add this line
          return (
            <Picker.Item key={month} label={shortMonthName} value={month} />
          ); // Modify this line
        })}
      </Picker>
    </View>
  );

  const YearPicker = () => (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedYear}
        style={styles.yearPicker} // Change this line
        onValueChange={(itemValue) => setSelectedYear(itemValue)}
      >
        {years.map((year) => (
          <Picker.Item key={year} label={year.toString()} value={year} />
        ))}
      </Picker>
    </View>
  );

  const handleAddStudent = () => {
    navigation.navigate('AddStudent', { selectedMonth, selectedYear });
  };

  const renderItem = ({ item }) => {
    const feeRecord = feeRecords.find((record) => record.studentId === item.id);
    return <StudentCard student={item} feeRecord={feeRecord} />;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.branchText}>{branch} Branch</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <View style={styles.dateFilterContainer}>
          <MonthPicker />
          <YearPicker />
          <BranchPicker />
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by student name"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setFilter('All')}
          style={styles.filterButton}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('Paid')}
          style={styles.filterButton}
        >
          <Text style={styles.filterText}>Paid</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('Unpaid')}
          style={styles.filterButton}
        >
          <Text style={styles.filterText}>Unpaid</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredStudents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.studentList}
      />
      <TouchableOpacity onPress={handleAddStudent} style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  dateFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectedDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: 'red', // Changed the background color to red
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: -7,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  signOutText: {
    color: 'white',
    alignSelf: 'center',
    fontWeight: '700',
    fontSize: 14,
    padding: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    marginTop: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    flex: 1, // Add this line to make the filters flexible in width
    marginHorizontal: 5,
    backgroundColor: '#0782F9',
  },
  filterText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    alignSelf: 'center',
  },
  studentList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0782F9',
  },
  addButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#0782F9',
    borderRadius: 5,
    marginLeft: 5,
    height: 35,
    justifyContent: 'center', // Add this line to center the content vertically
  },
  picker: {
    height: 35,
    width: 120,
    alignSelf: 'center', // Add this line to center the picker horizontally
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 5,
    fontSize: 16,
    backgroundColor: '#f1f1ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  yearPicker: {
    height: 40,
    width: 120,
  },
  branchText: {
    alignContent: 'flex-start',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0782F9',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
});
