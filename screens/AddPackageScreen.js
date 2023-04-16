import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';



const AddPackageScreen = () => {
  const [packageName, setPackageName] = useState('');
  const [courses, setCourses] = useState('');
  const [totalFee, setTotalFee] = useState('');

  const navigation = useNavigation();


  const handleSubmit = async () => {
    if (!packageName || !courses || !totalFee){
      alert('Please fill in all fields');
      return;
    }  

    try {
      const Package = {
        Package: packageName,
        Subjects: courses.split(',').map((subject) => subject.trim()),
        Amount: totalFee,
      };
      
  
      await addDoc(collection(db, 'packages'), Package);
      alert('Package added successfully');
      navigation.navigate('AdminHome', { Package });
    } catch (error) {
      console.error('Error adding package:', error);
      alert('Failed to add package');
    }
  
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={packageName}
        onChangeText={setPackageName}
        placeholder="Package Name"
      />
      <TextInput
        style={styles.input}
        value={courses}
        onChangeText={setCourses}
        placeholder="Courses (comma-separated)"
      />
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={totalFee}
        onChangeText={setTotalFee}
        placeholder="Total Fee"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addText}>Add Package</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AddPackageScreen;