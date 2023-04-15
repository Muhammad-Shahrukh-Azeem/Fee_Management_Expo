import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PackageCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.packageName}>{item.name}</Text>
      {item.courses.map((course, index) => (
        <Text key={index} style={styles.course}>
          {course.name}: {course.discountedFee}
        </Text>
      ))}
      <Text style={styles.discountedFee}>
        Total Discounted Fee: {item.discountedFee}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  packageName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  course: {
    fontSize: 16,
    marginBottom: 4,
  },
  discountedFee: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
});

export default PackageCard;
