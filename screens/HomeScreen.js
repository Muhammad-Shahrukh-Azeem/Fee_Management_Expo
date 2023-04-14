import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';


const HomeScreen = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filter, setFilter] = useState('All');

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
    return (
      <View style={[styles.studentCard, item.status === 'Paid' ? styles.paidCard : styles.unpaidCard]}>
        <Text>Name: {item.name}</Text>
        <Text>Subject/Package: {item.subject}</Text>
        <Text>Amount: {item.amount}</Text>
      </View>
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
      <ScrollView>
        <FlatList
          data={filteredStudents}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.studentList}
        />
      </ScrollView>
      <TouchableOpacity onPress={handleAddStudent} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Student</Text>
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
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
