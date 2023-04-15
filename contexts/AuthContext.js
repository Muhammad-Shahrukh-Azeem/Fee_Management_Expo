import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { auth } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      Alert.alert('Error', 'An error occurred while signing out.');
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};
