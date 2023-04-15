import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminHomeScreen from './screens/AdminHomeScreen';
import AddStudentScreen from './screens/AddStudentScreen';
import { AuthProvider } from './contexts/AuthContext';
import AddCourseScreen from './screens/AddCourseScreen';
import EditCourseScreen from './screens/EditCourseScreen';
import EditStudentScreen from './screens/EditStudentScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
          <Stack.Screen name="AddStudent" component={AddStudentScreen} />
          <Stack.Screen name="AddCourse" component={AddCourseScreen} />
          <Stack.Screen name="EditCourse" component={EditCourseScreen} />
          <Stack.Screen name="EditStudent" component={EditStudentScreen} />


        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});