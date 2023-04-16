import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PackageCard = ({ packageName, subjects, amount, onPress }) => {
  return (
<View style={styles.container}>
  <Text style={styles.packageName}>{packageName}</Text>
  <Text style={styles.subjects}>{subjects.join(', ')}</Text>
  <Text style={styles.amount}>Amount: {amount}</Text>
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>Select</Text>
  </TouchableOpacity>
</View>
  );
};

export default PackageCard;

// In PackageCard component
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  packageName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  subjects: {
    marginBottom: 10,
    fontSize: 16,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#0782F9',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
});

