import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Modal, ActivityIndicator } from 'react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const PackageItem = ({ item, handleDeletePackage, refreshPackages }) => {
  const [editing, setEditing] = useState(false);
  const [updatedPackageName, setUpdatedPackageName] = useState(item.packageName);
  const [updatedPackagePrice, setUpdatedPackagePrice] = useState(item.packagePrice.toString());
  const [updatedSubjects, setUpdatedSubjects] = useState(item.subjects ? item.subjects.join(', ') : '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePackage = async () => {
    if (updatedPackageName.trim() === '' || updatedPackagePrice.trim() === '' || updatedSubjects.trim() === '') {
      alert('Please fill in all the fields.');
      return;
    }

    setIsLoading(true);

    try {
      await updateDoc(doc(db, 'packages', item.id), {
        Package: updatedPackageName,
        Amount: parseFloat(updatedPackagePrice),
        Subjects: updatedSubjects.split(',').map(subject => subject.trim()),
      });
      setIsLoading(false);

      alert('Package updated successfully.');
      setEditing(false);
      refreshPackages();
    } catch (error) {
      alert('Error updating package: ' + error.message);
    }
  };
  const modal = (
    <Modal
      animationType="fade"
      transparent
      visible={isLoading}
      onRequestClose={() => { }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10, color: 'white' }}>Loading...</Text>
      </View>
    </Modal>
  );
  return (
    <>
      <View style={styles.packageContainer}>
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
              placeholder="Subjects (comma-separated)"
            />
          </>
        ) : (
          <>
            <Text style={styles.packageName}>{item.packageName}</Text>
            <Text style={styles.packagePrice}>{`${item.packagePrice}`}</Text>
            <Text style={styles.subjects}>{item.subjects ? item.subjects.join(', ') : ''}</Text>
          </>
        )}

        <View style={styles.buttonContainer}>
          {editing ? (
            <TouchableOpacity onPress={handleUpdatePackage} style={styles.editButton}>
              <Text style={styles.editText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setEditing(true)} style={styles.editButton}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => handleDeletePackage(item.id)} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      {modal}
    </>
  );
};

const styles = StyleSheet.create({
  packageContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
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
