import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Modal, ActivityIndicator } from 'react-native';
import { db } from '../firebase'; // Import db from your firebase config file
import { updateDoc, deleteDoc, doc, getDocs, collection } from 'firebase/firestore';
import EditStudentCard from '../components/EditStudentCard';
import { Picker } from '@react-native-picker/picker';

const EditStudentScreen = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [isLoading, setIsLoading] = useState(false);


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
      setIsLoading(true); 
      const studentRef = doc(db, 'studentData', id);
      await deleteDoc(studentRef);
      setIsLoading(false); 
      alert('Student deleted successfully.');
      fetchStudentData();
    } catch (error) {
      alert('Error deleting student: ' + error.message);
    }
  };

  const handleUpdateStudent = async (id, updatedName, updatedSubjects, updatedPackages, updatedAmount) => {
    const fieldsToUpdate = {};
    setIsLoading(true); 

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
      setIsLoading(false); 

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

  const modal = (
    <Modal
      animationType="fade"
      transparent
      visible={isLoading}
      onRequestClose={() => {}}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10, color: 'white' }}>Loading...</Text>
      </View>
    </Modal>
  );

  return (
    <>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.heading}>Edit Students</Text>
        <Picker
          selectedValue={selectedBranch}
          onValueChange={(itemValue) => setSelectedBranch(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Branch" value="" />
          <Picker.Item label="Johar" value="Johar" />
          <Picker.Item label="Model" value="Model" />
        </Picker>
      </View>

      {studentData.filter(student => !selectedBranch || student.branch === selectedBranch).map((item) => (
        <EditStudentCard
          key={item.id}
          item={item}
          handleUpdateStudent={handleUpdateStudent}
          handleDeleteStudent={handleDeleteStudent}
        />
      ))}
    </ScrollView>
    {modal}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  picker: {
    width: '45%',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0782F9',
  },
});

export default EditStudentScreen;
