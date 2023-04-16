import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RadioButton from 'react-native-paper/lib/module/components/RadioButton';
import { db } from '../firebase'; // Import db from your firebase config file
import { updateDoc, doc } from 'firebase/firestore'; // Import updateDoc and doc


const StudentCard = ({ item }) => {
    const [paymentOption, setPaymentOption] = useState('null');
    const [customPayment, setCustomPayment] = useState('');

    const updatePayment = async () => {
        const studentRef = doc(db, 'studentData', item.id);

        if (paymentOption === 'full') {
            await updateDoc(studentRef, { status: 'Paid' });
        } else if (paymentOption === 'custom' && customPayment) {
            const newAmount = item.amount - parseInt(customPayment);
            await updateDoc(studentRef, { amount: newAmount });

            if (newAmount <= 0) {
                await updateDoc(studentRef, { status: 'Paid' });
            }
        }
    };

    return (
        <View style={[styles.studentCard, item.status === 'Paid' ? styles.paidCard : styles.unpaidCard]}>
            <Text>Name: {item.name}</Text>
            <Text>Courses: {item.subjects && item.subjects.join(', ')}</Text>
            <Text>Packages: {item.packages && item.packages.map(pkg => pkg.packageName).join(', ')}</Text>
            <Text>Amount: {item.totalFee}</Text>
            <View style={styles.paymentOptionsContainer}>
                <View style={styles.radioButtonContainer}>
                    <RadioButton
                        value="null"
                        status={paymentOption === 'null' ? 'checked' : 'unchecked'}
                        onPress={() => setPaymentOption('null')}
                    />
                    <Text style={styles.radioButtonLabel}>Null</Text>
                </View>
                <View style={styles.radioButtonContainer}>
                    <RadioButton
                        value="full"
                        status={paymentOption === 'full' ? 'checked' : 'unchecked'}
                        onPress={() => setPaymentOption('full')}
                    />
                    <Text style={styles.radioButtonLabel}>Full Payment</Text>
                </View>
                <View style={styles.radioButtonContainer}>
                    <RadioButton
                        value="custom"
                        status={paymentOption === 'custom' ? 'checked' : 'unchecked'}
                        onPress={() => setPaymentOption('custom')}
                    />
                    <Text style={styles.radioButtonLabel}>Custom Payment</Text>
                </View>
            </View>
            {paymentOption === 'custom' && (
                <TextInput
                    style={styles.customPaymentInput}
                    keyboardType="number-pad"
                    value={customPayment}
                    onChangeText={setCustomPayment}
                    placeholder="Enter amount"
                />
            )}
            <TouchableOpacity style={styles.paymentUpdateButton} onPress={updatePayment}>
                <Text style={styles.paymentUpdateText}>Update Payment</Text>
            </TouchableOpacity>
        </View>
    );
};



const styles = StyleSheet.create({
    studentCard: {
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
    paymentOptionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButtonLabel: {
        marginLeft: 8,
    },
    customPaymentInput: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    paymentUpdateButton: {
        marginTop: 10,
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


export default StudentCard;
