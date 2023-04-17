import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const AddCourseScreen = () => {
    const [subjectName, setSubjectName] = useState('');
    const [subjectFee, setSubjectFee] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [branchName, setBranchName] = useState('');


    const navigation = useNavigation();

    const handleSubmit = async () => {
        if (subjectName.trim() === '' || subjectFee.trim() === '' || teacherName.trim() === '' || branchName.trim() === '') {
            alert('Please fill in all the fields.');
            return;
        }

        try {
            await addDoc(collection(db, 'courses'), {
                subjectName,
                subjectFee: parseFloat(subjectFee),
                teacherName,
                branchName,
            });

            alert('Course added successfully.');
            navigation.goBack();
        } catch (error) {
            alert('Error adding course: ' + error.message);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Add Course</Text>
            <TextInput
                placeholder="Subject Name"
                value={subjectName}
                onChangeText={text => setSubjectName(text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Subject Fee"
                value={subjectFee}
                onChangeText={text => setSubjectFee(text)}
                keyboardType="number-pad"
                style={styles.input}
            />
            <TextInput
                placeholder="Teacher Name"
                value={teacherName}
                onChangeText={text => setTeacherName(text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Branch Name"
                value={branchName}
                onChangeText={text => setBranchName(text)}
                style={styles.input}
            />
            <Picker
                selectedValue={branchName}
                onValueChange={(itemValue) => setBranchName(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select Branch" value="" />
                <Picker.Item label="Johar" value="Johar" />
                <Picker.Item label="Model" value="Model" />
            </Picker>
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Add Course</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddCourseScreen;

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
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#0782F9',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
});
