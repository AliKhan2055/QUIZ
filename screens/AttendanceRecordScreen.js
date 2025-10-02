// screens/AttendanceRecordScreen.js (CORRECTED CODE)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, Alert } from 'react-native';

const PRIMARY_COLOR = '#4CAF50';
const TEXT_COLOR = '#333333';
const LIGHT_GREY = '#F5F5F5';

const API_BASE_URL = 'http://YOUR_LOCAL_IP:5000'; // <<< IMPORTANT: USE YOUR LOCAL IP HERE!

const AttendanceRecordScreen = ({ route, navigation }) => {
    const { classId, className } = route.params;
    const [recordDetails, setRecordDetails] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        navigation.setOptions({ title: `${className} Records` });
        fetchLastAttendanceRecord();
    }, [classId, className]);

    const fetchLastAttendanceRecord = async () => {
        setIsLoading(true);
        try {
            // --- API CALL TO GET THE LAST RECORD FOR THIS CLASS ---
            const response = await fetch(`${API_BASE_URL}/api/attendance/record/${classId}`);
            
            if (response.status === 404) {
                setRecordDetails(null); // No records found
                setIsLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            // The API returns { date, teacher, studentStatuses: [...] }
            setRecordDetails(data);

        } catch (error) {
            console.error("Failed to fetch records:", error);
            Alert.alert('Error', 'Could not load attendance history: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        if (status === 'Present') return PRIMARY_COLOR;
        if (status === 'Absent') return '#F44336';
        if (status === 'Late') return '#FFC107';
        return '#666';
    };

    // --- NEW renderItem: Displays STUDENT Name and their STATUS ---
    const renderStudentStatus = ({ item }) => (
        <View style={styles.recordRow}>
            <Text style={styles.studentName}>{item.studentName || item.studentId}</Text>
            <View style={[styles.statusPill, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            </View>
        );
    }

    if (!recordDetails) {
        return (
            <View style={styles.noRecordContainer}>
                <Text style={styles.noRecordText}>No attendance records found for this class.</Text>
                <Text style={styles.noRecordSubText}>Please take attendance first.</Text>
            </View>
        );
    }
    
    // Total students and status counts calculation
    const totalStudents = recordDetails.studentStatuses.length;
    const presentCount = recordDetails.studentStatuses.filter(s => s.status === 'Present').length;
    const absentCount = recordDetails.studentStatuses.filter(s => s.status === 'Absent').length;
    const lateCount = recordDetails.studentStatuses.filter(s => s.status === 'Late').length;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Attendance for: {className}</Text>
                <Text style={styles.headerSubtitle}>Taken on: {recordDetails.date} by {recordDetails.teacher}</Text>
            </View>

            {/* Summary Block */}
            <View style={styles.summaryContainer}>
                <View style={[styles.summaryPill, {backgroundColor: PRIMARY_COLOR}]}><Text style={styles.summaryText}>{presentCount} Present</Text></View>
                <View style={[styles.summaryPill, {backgroundColor: '#F44336'}]}><Text style={styles.summaryText}>{absentCount} Absent</Text></View>
                <View style={[styles.summaryPill, {backgroundColor: '#FFC107'}]}><Text style={[styles.summaryText, {color: TEXT_COLOR}]}>{lateCount} Late</Text></View>
            </View>

            {/* Student List (The Data Source is NOW the list of studentStatuses) */}
            <FlatList
                data={recordDetails.studentStatuses}
                keyExtractor={(item) => item.studentId}
                renderItem={renderStudentStatus}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
};

// --- Styles (Ensure these match the professional theme) ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    noRecordContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    noRecordText: { fontSize: 18, fontWeight: 'bold', color: TEXT_COLOR, marginBottom: 5 },
    noRecordSubText: { fontSize: 14, color: '#666' },
    header: { padding: 15, backgroundColor: LIGHT_GREY, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: TEXT_COLOR },
    headerSubtitle: { fontSize: 14, color: '#666666', marginTop: 5 },
    summaryContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
    summaryPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
    summaryText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
    listContent: { paddingHorizontal: 10, paddingTop: 10 },
    recordRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    studentName: {
        fontSize: 16,
        fontWeight: '600',
        color: TEXT_COLOR,
        flex: 2,
    },
    statusPill: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 15,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 10,
    },
    statusText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 13,
    },
});

export default AttendanceRecordScreen;