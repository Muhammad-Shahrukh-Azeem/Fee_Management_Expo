import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';


const AdminLoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();
    const handleAdminLogin = () => {

        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredentials) => {
                const user = userCredentials.user;

                // get the user's role from the 'userRoles' collection in Firestore
                const docRef = doc(db, 'userRoles', user.uid);

                const docSnap = await getDoc(docRef);


                const userRole = docSnap.data().Role;

                // check if user is admin
                if (userRole === 'Admin') {
                    navigation.navigate('AdminHome');
                } else {
                    Alert.alert('Error', 'This user is not an admin.');
                }
            })
            .catch((error) => Alert.alert('Error', error.message));
    };



    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Admin Login</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity onPress={handleAdminLogin} style={styles.button}>
                <Text style={styles.buttonText}>Admin Login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AdminLoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#0782F9',
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
});
