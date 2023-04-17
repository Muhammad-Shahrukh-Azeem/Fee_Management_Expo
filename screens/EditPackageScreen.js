import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import PackageItem from '../components/PackageItem';
import { Picker } from '@react-native-picker/picker';

const EditPackageListScreen = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    const packageCollection = collection(db, 'packages');
    const packageSnapshot = await getDocs(packageCollection);
    const packageData = packageSnapshot.docs.map(doc => ({
      id: doc.id,
      packageName: doc.data().Package,
      packagePrice: doc.data().Amount,
      subjects: doc.data().Subjects,
      branchName: doc.data().Branch,
    }));
    setPackages(packageData);
    setLoading(false);
  };

  const handleDeletePackage = async (id) => {
    try {
      await deleteDoc(doc(db, 'packages', id));
      setPackages(packages.filter(pkg => pkg.id !== id));
      alert('Package deleted successfully');
    } catch (error) {
      alert('Error deleting package: ' + error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.heading}>Edit Packages</Text>
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

      <FlatList
        data={selectedBranch ? packages.filter(pkg => pkg.branchName === selectedBranch) : packages}
        renderItem={({ item }) => (
          <PackageItem
            item={item}
            handleDeletePackage={handleDeletePackage}
            refreshPackages={fetchPackages}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.packagesContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0782F9',
  },
  packagesContainer: {
    marginBottom: 20,
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
});

export default EditPackageListScreen;
