import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const AdminHomeScreen = () => {
  const navigation = useNavigation();

  const handleAddCourse = () => {
    navigation.navigate('AddCourse');
  };

  const handleEditStudent = () => {
    navigation.navigate('EditStudent');
  };

  const handleEditFee = () => {
    navigation.navigate('EditCourse');
  };

  const handleAddPackage = () => {
    navigation.navigate('AddPackage');
  };

  const handleEditPackage = () => {
    navigation.navigate('EditPackage');
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleAddCourse}>
        <Text style={styles.buttonText}>Add Course</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleEditFee}>
        <Text style={styles.buttonText}>Edit Course</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleEditStudent}>
        <Text style={styles.buttonText}>Edit Student</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleAddPackage}>
        <Text style={styles.buttonText}>Add Package</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleEditPackage}>
        <Text style={styles.buttonText}>Edit Package</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0782F9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '60%',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
