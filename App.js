import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AdminHomeScreen from './screens/AdminHomeScreen';
import AddStudentScreen from './screens/AddStudentScreen';
import UserRoleContext from './contexts/UserRoleContext';
import AddCourseScreen from './screens/AddCourseScreen';
import EditCourseScreen from './screens/EditCourseScreen';
import EditStudentScreen from './screens/EditStudentScreen';
import AddPackageScreen from './screens/AddPackageScreen';
import EditPackageScreen from './screens/EditPackageScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [userRole, setUserRole] = useState(null);

  return (
    <NavigationContainer>
      <UserRoleContext.Provider value={{ userRole, setUserRole }}>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
          <Stack.Screen name="AddStudent" component={AddStudentScreen} />
          <Stack.Screen name="AddCourse" component={AddCourseScreen} />
          <Stack.Screen name="EditCourse" component={EditCourseScreen} />
          <Stack.Screen name="EditStudent" component={EditStudentScreen} />
          <Stack.Screen name="AddPackage" component={AddPackageScreen} />
          <Stack.Screen name="EditPackage" component={EditPackageScreen} />
        </Stack.Navigator>
      </UserRoleContext.Provider>
    </NavigationContainer>
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
