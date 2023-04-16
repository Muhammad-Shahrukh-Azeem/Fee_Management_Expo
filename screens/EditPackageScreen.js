import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import PackageItem from '../components/PackageItem';

const EditPackageListScreen = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <Text style={styles.heading}>Edit Packages</Text>
      <FlatList
        data={packages}
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
});

export default EditPackageListScreen;
