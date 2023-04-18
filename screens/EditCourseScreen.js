import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View, Modal, ActivityIndicator } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import CourseItem from '../components/CourseItem';
import { Picker } from '@react-native-picker/picker';

const EditCourseScreen = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const courseCollection = collection(db, 'courses');
    const courseSnapshot = await getDocs(courseCollection);
    const courseData = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCourses(courseData);
    setLoading(false);
  };
  const modal = (
    <Modal
      animationType="fade"
      transparent
      visible={isLoading}
      onRequestClose={() => {}}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10, color: 'white' }}>Loading...</Text>
      </View>
    </Modal>
  );
  const handleDeleteCourse = async (id) => {

    try {
      setIsLoading(true);
      await deleteDoc(doc(db, 'courses', id));
      setCourses(courses.filter(course => course.id !== id));
      setIsLoading(false);
      alert('Course deleted successfully');
    } catch (error) {
      alert('Error deleting course: ' + error.message);
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
    <>
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.heading}>Edit Courses</Text>
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
        data={selectedBranch ? courses.filter(course => course.branchName === selectedBranch) : courses}
        renderItem={({ item }) => (
          <CourseItem
            item={item}
            handleDeleteCourse={handleDeleteCourse}
            refreshCourses={fetchCourses}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.coursesContainer}
      />
    </View>
    {modal}
    </>
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
  coursesContainer: {
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

export default EditCourseScreen;
