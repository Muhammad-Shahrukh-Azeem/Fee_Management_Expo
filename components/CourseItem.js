import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { db } from '../firebase';
import { updateDoc, doc } from 'firebase/firestore';

const CourseItem = ({ item, handleDeleteCourse, refreshCourses }) => {
    const [editing, setEditing] = useState(false);
    const [updatedSubjectName, setUpdatedSubjectName] = useState(item.subjectName);
    const [updatedSubjectFee, setUpdatedSubjectFee] = useState(item.subjectFee.toString());
    const [updatedTeacherName, setUpdatedTeacherName] = useState(item.teacherName);
    const [updatedBranchName, setUpdatedBranchName] = useState(item.branchName);
    const [isLoading, setIsLoading] = useState(false);


    const handleUpdateCourse = async () => {

        if (updatedSubjectName.trim() === '' || updatedSubjectFee.trim() === '' || updatedTeacherName.trim() === '' || updatedBranchName.trim() === '') {
            alert('Please fill in all the fields.');
            return;
        }

        try {
            setIsLoading(true);

            await updateDoc(doc(db, 'courses', item.id), {
                subjectName: updatedSubjectName,
                subjectFee: parseFloat(updatedSubjectFee),
                teacherName: updatedTeacherName,
                branchName: updatedBranchName,
            });
            setIsLoading(false);

            alert('Course updated successfully.');
            setEditing(false);
            refreshCourses();
        } catch (error) {
            alert('Error updating course: ' + error.message);
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
            <View style={[styles.courseContainer, item.status === 'Paid' ? styles.paidCard : styles.unpaidCard]}>
                {editing ? (
                    <>
                        <TextInput
                            value={updatedSubjectName}
                            onChangeText={text => setUpdatedSubjectName(text)}
                            style={styles.input}
                            placeholder="Subject Name"
                        />
                        <TextInput
                            value={updatedSubjectFee}
                            onChangeText={text => setUpdatedSubjectFee(text)}
                            keyboardType="number-pad"
                            style={styles.input}
                            placeholder="Subject Fee"
                        />
                        <TextInput
                            value={updatedTeacherName}
                            onChangeText={text => setUpdatedTeacherName(text)}
                            style={styles.input}
                            placeholder="Teacher Name"
                        />
                        <TextInput
                            value={updatedBranchName}
                            onChangeText={text => setUpdatedBranchName(text)}
                            style={styles.input}
                            placeholder="Branch Name"
                        />
                    </>
                ) : (
                    <>
                        <Text>Name: {item.teacherName}</Text>
                        <Text>Subject/Package: {item.subjectName}</Text>
                        <Text>Amount: {item.subjectFee}</Text>
                        <Text>Branch: {item.branchName}</Text>
                    </>
                )}

                <View style={styles.buttonContainer}>
                    {editing ? (
                        <TouchableOpacity onPress={handleUpdateCourse} style={styles.paymentUpdateButton}>
                            <Text style={styles.paymentUpdateText}>Save</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setEditing(true)} style={styles.paymentUpdateButton}>
                            <Text style={styles.paymentUpdateText}>Edit</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => handleDeleteCourse(item.id)} style={styles.paymentUpdateButton}>
                        <Text style={styles.paymentUpdateText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {modal}
        </>
    );
};

const styles = StyleSheet.create({
    courseContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    paidCard: {
        borderColor: 'green',
    },
    unpaidCard: {
        borderColor: 'red',
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
});

export default CourseItem;