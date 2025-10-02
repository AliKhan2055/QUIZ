// screens/LoginScreen.js (Updated with Professional Styles)
import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    SafeAreaView, // Use SafeAreaView for better layout on modern phones
    StatusBar,
    ActivityIndicator // Show a proper loading indicator
} from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        try {
            // --- 1. API CALL TO BACKEND ---
            // In a real app, you'd send { email, password } here and receive { token, user: { role } }
            
            console.log(`Attempting login for: ${email}`);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

            // SIMULATED API RESPONSE LOGIC:
            let userRole = 'teacher';
            if (email.toLowerCase().includes('student')) {
                 userRole = 'student';
            } else if (email.toLowerCase().includes('admin')) {
                 userRole = 'admin';
            }
            
            // Navigate to the main dashboard
            navigation.replace('Dashboard', { role: userRole }); 
            
        } catch (error) {
            console.error('Login Failed:', error);
            Alert.alert('Login Failed', 'Invalid credentials or network error. Please check your network.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={styles.container.backgroundColor} />
            <View style={styles.container}>
                
                <Text style={styles.logoText}>Attendance</Text>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#A0A0A0"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#A0A0A0"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                
                <TouchableOpacity 
                    style={[styles.button, isLoading && styles.buttonDisabled]} 
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.buttonText}>LOGIN</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.linkContainer}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkHighlight}>Register Here</Text></Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5', // Light grey background for a clean look
    },
    container: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    logoText: {
        fontSize: 40,
        fontWeight: '900',
        color: '#4CAF50', // Primary Green
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 40,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333333',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 15,
        // Optional: Add shadow for depth (iOS)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5, // Android shadow
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#4CAF50', // Primary Green
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        // Optional: Button shadow
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonDisabled: {
        backgroundColor: '#A5D6A7', // Lighter green when disabled/loading
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    linkContainer: {
        marginTop: 20,
    },
    linkText: {
        fontSize: 14,
        color: '#666666',
    },
    linkHighlight: {
        color: '#4CAF50', // Highlight link text with the primary color
        fontWeight: 'bold',
    },
});

export default LoginScreen;