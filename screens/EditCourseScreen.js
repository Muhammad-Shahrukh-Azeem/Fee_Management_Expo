import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import CourseItem from '../components/CourseItem';

const EditCourseScreen = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDeleteCourse = async (id) => {
    try {
      await deleteDoc(doc(db, 'courses', id));
      setCourses(courses.filter(course => course.id !== id));
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
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Courses</Text>
      <FlatList
        data={courses}
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
});

export default EditCourseScreen;