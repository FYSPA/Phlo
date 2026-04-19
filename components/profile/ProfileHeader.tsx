import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProfileHeaderProps {
    username: string;
    role?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, role = 'Estudiante de DuoCode' }) => {
    const initial = username?.charAt(0).toUpperCase() || 'U';
    
    return (
        <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
            <Text style={styles.username}>{username || 'Usuario'}</Text>
            <Text style={styles.joinDate}>{role}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    profileHeader: {
        alignItems: 'center',
        marginVertical: 30,
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#E5E5E5',
        paddingBottom: 25
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1CB0F6', // Azul Duolingo
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 4,
        borderColor: '#E5E5E5'
    },
    avatarInitial: {
        fontSize: 45,
        fontWeight: 'bold',
        color: '#fff'
    },
    username: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#4B4B4B'
    },
    joinDate: {
        fontSize: 16,
        color: '#AFAFAF',
        marginTop: 5,
        fontWeight: '600'
    }
});
