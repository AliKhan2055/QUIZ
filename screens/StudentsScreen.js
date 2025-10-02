// screens/StudentsScreen.js (Attendance Taking)
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from 'react-native';

const ATTENDANCE_OPTIONS = ['Present', 'Absent', 'Late'];
const PRIMARY_COLOR = '#4CAF50';
const ACCENT_COLOR = '#FFC107';
const DANGER_COLOR = '#F44336';
const TEXT_COLOR = '#333333';
const LIGHT_GREY = '#F5F5F5';

// Mock list of 10 students
const MOCK_STUDENTS = [
    { id: 's001', name: 'Emily Clark' }, { id: 's002', name: 'David Lee' }, 
    { id: 's003', name: 'Sophia Chen' }, { id: 's004', name: 'Michael Rodriguez' },
    { id: 's005', name: 'Olivia Wilson' }, { id: 's006', name: 'James Brown' },
    { id: 's007', name: 'Ava Martinez' }, { id: 's008', name: 'Ethan Garcia' },
    { id: 's009', name: 'Isabella Scott' }, { id: 's010', name: 'Noah King' },
];

const StudentsScreen = ({ route, navigation }) => {
    const { classId, className } = route.params;
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        navigation.setOptions({ title: className });
        fetchStudentsForClass(classId);
    }, [classId, className]);

    const fetchStudentsForClass = async () => {
        setIsLoading(true);
        try {
            // Simulate fetching 10 students
            await new Promise(resolve => setTimeout(resolve, 800)); 
            setStudents(MOCK_STUDENTS);
            
            // Initialize all to 'Present'
            const initialAttendance = MOCK_STUDENTS.reduce((acc, student) => {
                acc[student.id] = 'Present'; 
                return acc;
            }, {});
            setAttendanceData(initialAttendance);

        } catch (error) {
            Alert.alert('Error', 'Could not load student list.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAttendance = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status,
        }));
    };

    const handleSubmitAttendance = async () => {
        setIsSubmitting(true);
        const submissionPayload = {
            classId: classId,
            date: new Date().toISOString().split('T')[0],
            studentStatuses: students.map(student => ({
                studentId: student.id,
                status: attendanceData[student.id] || 'Absent',
            })),
        };

        try {
            // API CALL TO SUBMIT ATTENDANCE
            console.log('Submitting:', submissionPayload);
            await new Promise(resolve => setTimeout(resolve, 2000)); 

            Alert.alert('Success', `Attendance recorded for ${className} (${students.length} students).`);
            navigation.goBack();

        } catch (error) {
            Alert.alert('Error', 'Failed to submit attendance.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPillColor = (status, isActive) => {
        let color = '#CCCCCC'; 
        if (status === 'Present') color = PRIMARY_COLOR;
        else if (status === 'Absent') color = DANGER_COLOR;
        else if (status === 'Late') color = ACCENT_COLOR;
        
        return isActive ? color : LIGHT_GREY;
    };

    const renderStudentItem = ({ item }) => {
        const currentStatus = attendanceData[item.id];
        return (
            <View style={studentStyles.studentRow}>
                <Text style={studentStyles.studentName} numberOfLines={1}>{item.name}</Text>
                
                <View style={studentStyles.statusPills}>
                    {ATTENDANCE_OPTIONS.map(status => {
                        const isActive = currentStatus === status;
                        const pillBackgroundColor = getPillColor(status, isActive);
                        const pillTextColor = isActive && status !== 'Late' ? '#FFFFFF' : TEXT_COLOR;
                        
                        return (
                            <TouchableOpacity
                                key={status}
                                style={[
                                    studentStyles.pill,
                                    { backgroundColor: pillBackgroundColor },
                                    isActive && studentStyles.activePillBorder
                                ]}
                                onPress={() => toggleAttendance(item.id, status)}
                            >
                                <Text style={[studentStyles.pillText, { color: pillTextColor }]}>
                                    {status[0]}
                                </Text> 
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={studentStyles.loadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                <Text style={studentStyles.loadingText}>Loading {MOCK_STUDENTS.length} students...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={studentStyles.safeArea}>
            <View style={studentStyles.container}>
                <FlatList
                    data={students}
                    keyExtractor={(item) => item.id}
                    renderItem={renderStudentItem}
                    ListHeaderComponent={() => (
                        <View style={studentStyles.headerBox}>
                            <Text style={studentStyles.headerText}>
                                {className} ({students.length} Students)
                            </Text>
                            <Text style={studentStyles.dateText}>
                                Date: {new Date().toLocaleDateString()}
                            </Text>
                        </View>
                    )}
                    stickyHeaderIndices={[0]}
                    contentContainerStyle={studentStyles.listContent}
                />
                
                <TouchableOpacity 
                    style={[studentStyles.submitButton, isSubmitting && studentStyles.submitButtonDisabled]} 
                    onPress={handleSubmitAttendance}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                         <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={studentStyles.submitButtonText}>SUBMIT ATTENDANCE</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
// ... (studentStyles from the previous expert response)
const studentStyles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: TEXT_COLOR },
    headerBox: { padding: 15, backgroundColor: LIGHT_GREY, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', marginBottom: 5 },
    headerText: { fontSize: 18, fontWeight: 'bold', color: PRIMARY_COLOR },
    dateText: { fontSize: 14, color: '#666666', marginTop: 5 },
    listContent: { paddingBottom: 100 },
    studentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#EEEEEE', backgroundColor: '#FFFFFF' },
    studentName: { flex: 1, fontSize: 16, fontWeight: '600', color: TEXT_COLOR, marginRight: 10 },
    statusPills: { flexDirection: 'row' },
    pill: { width: 35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center', marginLeft: 8, borderWidth: 1.5, borderColor: LIGHT_GREY },
    activePillBorder: { borderColor: '#9E9E9E' },
    pillText: { fontSize: 14, fontWeight: 'bold' },
    submitButton: { position: 'absolute', bottom: 0, width: '100%', paddingVertical: 20, backgroundColor: PRIMARY_COLOR, justifyContent: 'center', alignItems: 'center', paddingBottom: 35, },
    submitButtonDisabled: { backgroundColor: '#A5D6A7' },
    submitButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default StudentsScreen;