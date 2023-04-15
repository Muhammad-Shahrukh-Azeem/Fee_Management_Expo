import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { db } from '../firebase'; // Import db from your firebase config file
import { updateDoc, doc, getDocs, collection } from 'firebase/firestore'; // Import updateDoc, doc, getDocs, and collection
import EditStudentCard from '../components/EditStudentCard';

const EditStudentScreen = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'studentData'));
      const students = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setStudentData(students);
    } catch (error) {
      console.error('Error fetching student data: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudent = async (id, updatedName, updatedSubject, updatedAmount) => {
    if (updatedName.trim() === '' || updatedSubject.trim() === '' || updatedAmount.trim() === '') {
      alert('Please fill in all the fields.');
      return;
    }

    try {
      const studentRef = doc(db, 'studentData', id);
      await updateDoc(studentRef, {
        name: updatedName,
        subject: updatedSubject,
        amount: parseFloat(updatedAmount),
      });

      alert('Student updated successfully.');
      fetchStudentData();
    } catch (error) {
      alert('Error updating student: ' + error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {studentData.map((item) => (
        <EditStudentCard
          key={item.id}
          item={item}
          handleUpdateStudent={handleUpdateStudent}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default EditStudentScreen;
