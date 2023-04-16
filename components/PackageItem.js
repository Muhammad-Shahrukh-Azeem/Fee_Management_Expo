import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PackageItem = ({ item, handleDeletePackage, refreshPackages }) => {
  const navigation = useNavigation();

  const handleEditPackage = () => {
    navigation.navigate('EditPackage', { item, refreshPackages });
  };

  return (
    <View style={styles.packageItem}>
      <Text style={styles.packageName}>{item.packageName}</Text>
      <TouchableOpacity onPress={handleEditPackage} style={styles.editButton}>
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeletePackage(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  packageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 4,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#0782F9',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PackageItem;

   
