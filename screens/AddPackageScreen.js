import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View,  Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { Picker } from '@react-native-picker/picker';


const AddPackageScreen = () => {
  const [packageName, setPackageName] = useState('');
  const [courses, setCourses] = useState('');
  const [totalFee, setTotalFee] = useState('');
  const [branch, setBranch] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!packageName || !courses || !totalFee || !branch) {
      alert('Please fill in all fields');
      return;
    }
    setIsLoading(true);

    try {
      const Package = {
        Package: packageName,
        Subjects: courses.split(',').map((subject) => subject.trim()),
        Amount: totalFee,
        Branch: branch,
      };

      await addDoc(collection(db, 'packages'), Package);
      setIsLoading(false);

      alert('Package added successfully');
      navigation.navigate('AdminHome', { Package });
    } catch (error) {
      console.error('Error adding package:', error);
      alert('Failed to add package');
    }
  };

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
      <Picker
        selectedValue={branch}
        onValueChange={(itemValue) => setBranch(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Branch" value="" />
        <Picker.Item label="Johar" value="Johar" />
        <Picker.Item label="Model" value="Model" />
      </Picker>
      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addText}>Add Package</Text>
      </TouchableOpacity>
    </View>
    {modal}
    </>
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
