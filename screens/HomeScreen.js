import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import StudentCard from '../components/StudentCard'; // Import StudentCard

const HomeScreen = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [packages, setPackages] = useState([]);


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'studentData'), (snapshot) => {
      const fetchedStudents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(fetchedStudents);
      setFilteredStudents(fetchedStudents);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(students.filter((student) => student.status === filter));
    }
  }, [filter, students]);

  

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  const handleAddStudent = () => {
    navigation.navigate('AddStudent');
  };

  const renderItem = ({ item }) => {
    const selectedPackage = packages.find(pkg => pkg.id === item.packageId);
  
    return (
      <StudentCard
        item={item}
        subjects={item.subjects}
        totalCost={item.totalCost}
        packageName={selectedPackage?.packageName}
        packageAmount={selectedPackage?.amount}
      />
    );
  };
  
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilter('All')} style={styles.filterButton}>
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('Paid')} style={styles.filterButton}>
          <Text style={styles.filterText}>Paid</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('Unpaid')} style={styles.filterButton}>
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
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  signOutButton: {
    backgroundColor: '#0782F9',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  signOutText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
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
    backgroundColor: '#0782F9',
  },
  filterText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  studentList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  studentCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  paidCard: {
    backgroundColor: '#d1ebff',
  },
  unpaidCard: {
    backgroundColor: '#ffd1d1',
  },
  addButton: {
    backgroundColor: 'center',
  },
  paymentUpdateText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
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

});