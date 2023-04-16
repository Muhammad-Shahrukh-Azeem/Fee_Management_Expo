import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { db } from '../firebase'; // Import db from your firebase config file
import { updateDoc, deleteDoc, doc, getDocs, collection } from 'firebase/firestore';
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
  const handleDeleteStudent = async (id) => {
    try {
      const studentRef = doc(db, 'studentData', id);
      await deleteDoc(studentRef);

      alert('Student deleted successfully.');
      fetchStudentData();
    } catch (error) {
      alert('Error deleting student: ' + error.message);
    }
  };

  const handleUpdateStudent = async (id, updatedName, updatedSubjects, updatedPackages, updatedAmount) => {
    const fieldsToUpdate = {};

    if (updatedName.trim() !== '') {
      fieldsToUpdate.name = updatedName;
    }

    if (updatedSubjects.some(subject => subject.trim() !== '')) {
      fieldsToUpdate.subjects = updatedSubjects;
    }

    if (updatedPackages.some(pkg => pkg.packageName.trim() !== '')) {
      fieldsToUpdate.packages = updatedPackages;
    }

    if (updatedAmount.trim() !== '') {
      fieldsToUpdate.totalFee = parseFloat(updatedAmount);
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      alert('Please fill in at least one field.');
      return;
    }

    try {
      const studentRef = doc(db, 'studentData', id);
      await updateDoc(studentRef, fieldsToUpdate);

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
          handleDeleteStudent={handleDeleteStudent} // Add this line
          totalAmount={item.totalFee}
          subject={item.subjects ? item.subjects.join(', ') : ''}
          package={item.packages ? item.packages.map(pkg => pkg.packageName).join(', ') : ''}
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
