import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const PackageItem = ({ item, handleDeletePackage, refreshPackages }) => {
  const [editing, setEditing] = useState(false);
  const [updatedPackageName, setUpdatedPackageName] = useState(item.packageName);
  const [updatedPackagePrice, setUpdatedPackagePrice] = useState(item.packagePrice.toString());
  const [updatedSubjects, setUpdatedSubjects] = useState(item.subjects ? item.subjects.join(', ') : '');
  const navigation = useNavigation();

  const handleUpdatePackage = async () => {
    if (updatedPackageName.trim() === '' || updatedPackagePrice.trim() === '' || updatedSubjects.trim() === '') {
      alert('Please fill in all the fields.');
      return;
    }

    try {
      await updateDoc(doc(db, 'packages', item.id), {
        packageName: updatedPackageName,
        packagePrice: parseFloat(updatedPackagePrice),
        subjects: updatedSubjects.split(',').map(subject => subject.trim()),
      });

      alert('Package updated successfully.');
      setEditing(false);
      refreshPackages();
    } catch (error) {
      alert('Error updating package: ' + error.message);
    }
  };

  const handleEditPackage = () => {
    navigation.navigate('EditPackage', { packageData: item, refreshPackages });
    setEditing(true);
  };

  
  return (
    <View style={[styles.packageContainer, item.status === 'Active' ? styles.activeCard : styles.inactiveCard]}>
      {editing ? (
        <>
          <TextInput
            value={updatedPackageName}
            onChangeText={text => setUpdatedPackageName(text)}
            style={styles.input}
            placeholder="Package Name"
          />
          <TextInput
            value={updatedPackagePrice}
            onChangeText={text => setUpdatedPackagePrice(text)}
            keyboardType="number-pad"
            style={styles.input}
            placeholder="Package Price"
          />
          <TextInput
            value={updatedSubjects}
            onChangeText={text => setUpdatedSubjects(text)}
            style={styles.input}
            placeholder="Subjects (comma separated)"
          />
        </>
      ) : (
        <>
          <Text style={styles.packageName}>{item.packageName}</Text>
          <Text style={styles.packagePrice}>{`$${item.packagePrice}`}</Text>
          <Text style={styles.subjects}>{item.subjects ? item.subjects.join(', ') : ''}</Text>
        </>
      )}

      <View style={styles.buttonContainer}>
        {editing ? (
          <TouchableOpacity onPress={handleUpdatePackage} style={styles.updateButton}>
            <Text style={styles.updateText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleEditPackage} style={styles.updateButton}>
            <Text style={styles.updateText}>Edit</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => handleDeletePackage(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    packageContainer: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
    },
    activeCard: {
      borderColor: 'green',
    },
    inactiveCard: {
      borderColor: 'red',
    },
    packageName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    packagePrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#0782F9',
    },
    subjects: {
      fontSize: 16,
      color: '#666',
    },
    input: {
      marginTop: 10,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    buttonContainer: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    paymentUpdateButton: {
      backgroundColor: 'blue',
      borderRadius: 4,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    paymentUpdateText: {
      color: 'white',
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
    activePackage: {
      borderColor: 'green',
    },
    inactivePackage: {
      borderColor: 'red',
    },
  });
  
  export default PackageItem;