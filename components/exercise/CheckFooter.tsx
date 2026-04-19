import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CheckFooterProps {
    lives: number;
    onCheck: () => void;
}

export default function CheckFooter({ lives, onCheck }: CheckFooterProps) {
    return (
        <View style={styles.footer}>
            <TouchableOpacity
                style={[
                    styles.checkButton,
                    lives === 0 && { backgroundColor: '#ccc', borderBottomColor: '#aaa' }
                ]}
                onPress={onCheck}
                disabled={lives === 0}
            >
                <Text style={styles.checkButtonText}>
                    {lives === 0 ? 'SIN VIDAS' : 'COMPROBAR'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        padding: 20,
        borderTopWidth: 2,
        borderTopColor: '#E5E5E5'
    },
    checkButton: {
        backgroundColor: '#58CC02',
        padding: 18,
        borderRadius: 16,
        borderBottomWidth: 5,
        borderBottomColor: '#46A302',
        alignItems: 'center'
    },
    checkButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1.2 }
});
