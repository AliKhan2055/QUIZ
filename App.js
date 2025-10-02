// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

// --- Import All Screens ---
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import StudentsScreen from './screens/StudentsScreen';
import AttendanceRecordScreen from './screens/AttendanceRecordScreen';

// Define the primary color for a consistent theme
const PRIMARY_COLOR = '#4CAF50'; 

// Create the Stack Navigator instance
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      {/* Set the status bar style for the entire app */}
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
      
      {/* Configure the default header style for all screens */}
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: PRIMARY_COLOR, // Primary Green header background
          },
          headerTintColor: '#fff', // White text color for header titles and back buttons
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 20,
          },
        }}
      >
        
        {/* 1. AUTHENTICATION FLOW (Pre-Login) */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          // Hide the header on the Login screen for a cleaner look
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Teacher Registration' }} 
        />
        
        {/* 2. MAIN APPLICATION FLOW (Post-Login) */}
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ 
            title: 'Class Dashboard', 
            // Prevent users from going back to Login after authentication
            headerLeft: () => null 
          }} 
        />
        
        {/* 3. ATTENDANCE ACTIONS */}
        <Stack.Screen 
          name="StudentsScreen" 
          component={StudentsScreen} 
          // Dynamically set the title based on the class selected
          options={({ route }) => ({ title: route.params.className || 'Take Attendance' })} 
        />
        <Stack.Screen
          name="AttendanceRecordScreen"
          component={AttendanceRecordScreen}
          // Dynamically set the title for the record view
          options={({ route }) => ({ title: `${route.params.className} Records` })}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;