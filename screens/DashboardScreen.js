// screens/DashboardScreen.js (Complete Code)
import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Alert, 
    ActivityIndicator, 
    SafeAreaView, 
    FlatList 
} from 'react-native';
// Note: Ensure react-native-vector-icons is installed and linked (or use Expo's default setup)
import Icon from 'react-native-vector-icons/MaterialIcons'; 

// --- Constants for Theme Consistency ---
const PRIMARY_COLOR = '#4CAF50';
const LIGHT_GREY = '#F5F5F5';
const TEXT_COLOR = '#333333';

const MOCK_CLASSES = [
    { id: 'c001', name: 'Advanced Calculus', students: 10, lastTaken: 'Yesterday' },
    { id: 'c002', name: 'Web Development (React)', students: 10, lastTaken: 'Today' },
    { id: 'c003', name: 'Database Management', students: 10, lastTaken: '3 Days Ago' },
    { id: 'c004', name: 'Software Testing', students: 10, lastTaken: 'Never' },
];

const DashboardScreen = ({ route, navigation }) => {
    const { role } = route.params; // Expects role: 'teacher', 'student', or 'admin'
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching the teacher's classes from the backend
        setIsLoading(true);
        setTimeout(() => {
            setClasses(MOCK_CLASSES);
            setIsLoading(false);
        }, 1000);
    }, []);

    // --- Core Action Handler (Replaces direct onPress on the card) ---
    const handleClassPress = (classItem) => {
        Alert.alert(
            `Actions for ${classItem.name}`,
            'What would you like to do?',
            [
                {
                    text: 'Take Attendance',
                    onPress: () => navigation.navigate('StudentsScreen', { 
                        classId: classItem.id, 
                        className: classItem.name 
                    }),
                    style: 'default',
                },
                {
                    text: 'View Records',
                    onPress: () => navigation.navigate('AttendanceRecordScreen', { 
                        classId: classItem.id, 
                        className: classItem.name 
                    }),
                    style: 'default',
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    // --- Component for Teacher Role ---
    const TeacherDashboard = () => (
        <View style={styles.dashboardContainer}>
            <Text style={styles.sectionTitle}>My Classes ({classes.length})</Text>
            
            <FlatList
                data={classes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.card} 
                        onPress={() => handleClassPress(item)} 
                    >
                        {/* Class Name and Student Count */}
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.studentCountText}>{item.students} Students</Text>
                        </View>
                        
                        {/* History and Action Indicator */}
                        <View style={styles.cardFooter}>
                            <Icon name="history" size={16} color="#666" />
                            <Text style={styles.cardSubtitle}>Last Attendance: {item.lastTaken}</Text>
                            {/* Menu icon indicates more options are available (via Alert) */}
                            <Icon name="menu" size={18} color={PRIMARY_COLOR} style={{marginLeft: 'auto'}} />
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
            />

            {/* Floating Action Button for Global Reports */}
            <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => Alert.alert('Feature Demo', 'This would show school-wide reports, accessible by teachers/admins.')}
            >
                <Icon name="assessment" size={24} color="#FFFFFF" style={{marginRight: 10}} />
                <Text style={styles.actionText}>View Global Reports</Text>
            </TouchableOpacity>
        </View>
    );
    
    // --- Render Logic ---
    if (isLoading) {
        return <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loading} />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Top Header Section */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Welcome!</Text>
                <Text style={styles.roleText}>{role.toUpperCase()} Dashboard</Text>
            </View>
            
            {/* Display relevant dashboard based on role */}
            {role === 'teacher' ? (
                <TeacherDashboard />
            ) : (
                <View style={{padding: 20}}>
                    <Text style={styles.infoText}>Role: {role}. Dashboard content not yet defined.</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

// --- Stylesheet for Professional Look ---
const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: LIGHT_GREY 
    },
    loading: { 
        flex: 1, 
        justifyContent: 'center' 
    },
    header: { 
        padding: 20, 
        backgroundColor: PRIMARY_COLOR 
    },
    headerText: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#FFFFFF' 
    },
    roleText: { 
        fontSize: 14, 
        color: '#A5D6A7' // Light green variant
    },
    dashboardContainer: { 
        flex: 1 
    },
    sectionTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: TEXT_COLOR, 
        paddingHorizontal: 20, 
        paddingTop: 15, 
        marginBottom: 10 
    },
    listContent: { 
        paddingHorizontal: 10, 
        paddingBottom: 120 // Space for the floating button
    },
    
    // Card Styles
    card: { 
        backgroundColor: '#FFFFFF', 
        borderRadius: 12, 
        marginHorizontal: 10, 
        marginBottom: 15, 
        padding: 15,
        // Elevation/Shadow for a "lifted" professional look
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 3, 
        elevation: 5,
    },
    cardHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingBottom: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: LIGHT_GREY 
    },
    cardTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: PRIMARY_COLOR 
    },
    studentCountText: { 
        fontSize: 14, 
        color: '#666' 
    },
    cardFooter: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingTop: 10 
    },
    cardSubtitle: { 
        fontSize: 13, 
        color: '#666', 
        marginLeft: 5 
    },

    // Floating Action Button Styles
    actionButton: { 
        position: 'absolute', 
        bottom: 30, 
        left: 20, 
        right: 20,
        flexDirection: 'row',
        backgroundColor: '#66BB6A', // Slightly darker green for contrast
        padding: 15, 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center',
        shadowColor: PRIMARY_COLOR, 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.4, 
        shadowRadius: 5, 
        elevation: 8,
    },
    actionText: { 
        color: '#FFFFFF', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    infoText: { 
        fontSize: 16, 
        color: TEXT_COLOR 
    },
});

export default DashboardScreen;