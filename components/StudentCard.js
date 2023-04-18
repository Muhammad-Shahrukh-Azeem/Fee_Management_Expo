import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View, Modal, ActivityIndicator
} from 'react-native';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const StudentCard = ({ student, feeRecord }) => {
    if (!feeRecord) {
        return (
            <View style={styles.studentCard}>
                <Text>No fee record found for this month.</Text>
            </View>
        );
    }
    const [paymentStatus, setPaymentStatus] = useState('Null');
    const [customAmount, setCustomAmount] = useState('');
    const [displayedTotalFee, setDisplayedTotalFee] = useState(student.totalFee);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        setDisplayedTotalFee(feeRecord.totalFee);
    }, [feeRecord.totalFee]);

    const updateFeeRecord = async (status, amount) => {
        const feeRecordRef = doc(db, 'feeRecords', feeRecord.id);

        let updates = { status: status };

        if (amount) {
            updates['amountPaid'] = (feeRecord.amountPaid || 0) + amount;
            if (updates['amountPaid'] >= student.totalFee) {
                updates['status'] = 'Paid';
                updates['amountPaid'] = student.totalFee;
            }
        }

        await updateDoc(feeRecordRef, updates);
    };

    const handleCustomPayment = () => {
        if (feeRecord.status !== 'Paid') {
            updateFeeRecord('Unpaid', parseInt(customAmount));
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
    const handleUpdatePayment = () => {
        setIsLoading(true);

        if (paymentStatus === 'Custom Payment') {
            handleCustomPayment();
        } else if (paymentStatus === 'Full Payment') {
            updateFeeRecord('Paid', student.totalFee - (feeRecord.amountPaid || 0));
        } else if (paymentStatus === 'Null') {
            const newStatus = (feeRecord.amountPaid || 0) >= student.totalFee ? 'Paid' : 'Unpaid';
            updateFeeRecord(newStatus);
        }
        setIsLoading(false);

    };


    return (
        <>
            <View style={styles.studentCard}>
                <View style={styles.studentInfo}>
                    <View style={styles.studentInfoRow}>
                        <Text style={styles.studentInfoTextBold}>Name:</Text>
                        <Text style={styles.studentInfoText}>{student.name}</Text>
                    </View>
                    <View style={styles.studentInfoRow}>
                        <Text style={styles.studentInfoTextBold}>Courses:</Text>
                        <Text style={styles.studentInfoText}>
                            {feeRecord.subjects && feeRecord.subjects.join(', ')} {/* Change this line */}
                        </Text>
                    </View>
                    <View style={styles.studentInfoRow}>
                        <Text style={styles.studentInfoTextBold}>Packages:</Text>
                        <Text style={styles.studentInfoText}>
                            {feeRecord.packages && feeRecord.packages.map(pkg => pkg.packageName).join(', ')} {/* Change this line */}
                        </Text>
                    </View>
                    <View style={styles.studentInfoRow}>
                        <Text style={styles.studentInfoTextBold}>Amount:</Text>
                        <Text style={styles.studentInfoText}>{displayedTotalFee}</Text>
                    </View>
                    <View style={styles.studentInfoRow}>
                        <Text style={styles.studentInfoTextBold}>Status:</Text>
                        <Text style={feeRecord.status === 'Paid' ? styles.paidStatus : styles.unpaidStatus}>
                            {feeRecord.status}
                        </Text>
                    </View>
                    <View style={styles.studentInfoRow}>
                        <Text style={styles.studentInfoTextBold}>Amount Paid:</Text>
                        <Text style={styles.studentInfoText}>{feeRecord.amountPaid || 0}</Text>
                    </View>
                </View>
                <View style={styles.paymentSection}>
                    <View style={styles.radioContainer}>
                        <TouchableOpacity
                            style={[
                                styles.radio,
                                paymentStatus === 'Null' ? styles.radioSelected : null,
                            ]}
                            onPress={() => setPaymentStatus('Null')}
                        >
                            <Text style={styles.radioText}>Null</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.radio,
                                paymentStatus === 'Full Payment' ? styles.radioSelected : null,
                            ]}
                            onPress={() => setPaymentStatus('Full Payment')}
                        >
                            <Text style={styles.radioText}>Full Payment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.radio,
                                paymentStatus === 'Custom Payment' ? styles.radioSelected : null,
                            ]}
                            onPress={() => setPaymentStatus('Custom Payment')}
                        >
                            <Text style={styles.radioText}>Custom Payment</Text>
                        </TouchableOpacity>
                    </View>
                    {paymentStatus === 'Custom Payment' && (
                        <TextInput
                            style={styles.customAmountInput}
                            placeholder="Enter custom amount"
                            value={customAmount}
                            onChangeText={setCustomAmount}
                            keyboardType="numeric"
                        />
                    )}
                    <TouchableOpacity
                        style={styles.updatePaymentButton}
                        onPress={handleUpdatePayment}
                    >
                        <Text style={styles.updatePaymentText}>Update Payment</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {modal}
        </>
    );
};


const styles = StyleSheet.create({
    studentCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    studentInfo: {
        flex: 1,
        marginRight: 20,
    },
    studentInfoRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    studentInfoTextBold: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 5,
    },
    studentInfoText: {
        fontSize: 14,
    },
    paidStatus: {
        color: 'green',
    },
    unpaidStatus: {
        color: 'red',
    },
    paymentSection: {
        flex: 1,
        alignItems: 'flex-end',
    },
    radioContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    radio: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
    },
    radioSelected: {
        borderColor: '#0782F9',
        backgroundColor: '#E6F1FF', // Add this line
    },

    radioText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    customAmountInput: {
        marginTop: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: '100%',
    },
    updatePaymentButton: {
        backgroundColor: '#0782F9',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 5,
        alignSelf: 'flex-end',
        marginTop: 10,
    },
    updatePaymentText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },
});

export default StudentCard;