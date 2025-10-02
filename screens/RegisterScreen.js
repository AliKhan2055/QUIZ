// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('teacher'); // Default role for registration
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        setIsLoading(true);
        try {
            // --- 1. API CALL TO BACKEND ---
            // Example: const response = await fetch('YOUR_API_URL/api/auth/register', { ... });
            // For now, simulate success:
            console.log(`Registering user: ${name} with role: ${role}`);
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            Alert.alert('Success', 'Account created successfully! Please log in.');
            navigation.goBack(); // Navigate back to the login screen
            
        } catch (error) {
            console.error('Registration Failed:', error);
            Alert.alert('Registration Failed', 'Could not create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            {/* Simple Role Selector (Could be a Picker/Dropdown) */}
            <Text style={styles.roleText}>Registering as: {role.toUpperCase()}</Text>
            
            <TouchableOpacity 
                style={styles.button} 
                onPress={handleRegister}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>{isLoading ? 'Registering...' : 'Register'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.linkText}>Already have an account? Go back to Login</Text>
            </TouchableOpacity>
        </View>
    );
};

// ... add styles (omitted for brevity)
const styles = StyleSheet.create({ /* ... */ }); 

export default RegisterScreen;