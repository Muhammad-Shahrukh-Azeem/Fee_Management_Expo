import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const EditStudentCard = ({ item = {}, handleUpdateStudent, handleDeleteStudent }) => {
  const [updatedName, setUpdatedName] = useState(item.name || '');
  const [updatedSubject, setUpdatedSubject] = useState((item.subjects || []).join(', '));
  const [updatedPackages, setupdatedPackages] = useState((item.packages || []).map(pkg => pkg.packageName).join(', '));
  const [updatedAmount, setUpdatedAmount] = useState(item.totalFee ? item.totalFee.toString() : '');


  const handleSubmit = () => {
    handleUpdateStudent(item.id, updatedName, updatedSubject.split(',').map(s => s.trim()), updatedPackages.split(',').map(p => ({ packageName: p.trim() })), updatedAmount);
  };

  const handleDelete = () => {
    handleDeleteStudent(item.id);
  };

  return (
    <View style={styles.studentCard}>
      <TextInput
        style={styles.input}
        value={updatedName}
        onChangeText={setUpdatedName}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={updatedSubject}
        onChangeText={setUpdatedSubject}
        placeholder="Subject"
      />
      <TextInput
        style={styles.input}
        value={updatedPackages}
        onChangeText={setupdatedPackages}
        placeholder="Package"
      />
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={updatedAmount}
        onChangeText={setUpdatedAmount}
        placeholder="Amount"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
          <Text style={styles.updateText}>Update Student</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Student</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  studentCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'grey',
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  updateText: {
    color: 'white',
    fontWeight: 'bold',
  },

  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  updateButton: {
    flex: 1,
    backgroundColor: 'blue',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 4, // Add this line to separate the buttons
  },
  deleteButton: {
    flex: 1,
    backgroundColor: 'red',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 4, // Add this line to separate the buttons
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

});

export default EditStudentCard;
