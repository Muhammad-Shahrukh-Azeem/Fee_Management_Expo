import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const EditStudentCard = ({ item, handleUpdateStudent }) => {
  const [updatedName, setUpdatedName] = useState(item.name);
  const [updatedSubject, setUpdatedSubject] = useState(item.subject);
  const [updatedAmount, setUpdatedAmount] = useState(item.amount ? item.amount.toString() : '');

  const handleSubmit = () => {
    handleUpdateStudent(item.id, updatedName, updatedSubject, updatedAmount);
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
        placeholder="Subject/Package"
      />
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={updatedAmount}
        onChangeText={setUpdatedAmount}
        placeholder="Amount"
      />
      <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
        <Text style={styles.updateText}>Update Student</Text>
      </TouchableOpacity>
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
  updateButton: {
    marginTop: 10,
    backgroundColor: 'blue',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  updateText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EditStudentCard;
