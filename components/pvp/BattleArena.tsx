import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BlocklyEditor from '../map/BlocklyEditor';

interface Props {
    instruction: string;
    toolboxConfig: any;
    currentCode: string;
    onCodeChange: (code: string) => void;
    onCheck: () => void;
    botThinking: boolean;
    canCheck: boolean;
}

export default function BattleArena({
    instruction,
    toolboxConfig,
    currentCode,
    onCodeChange,
    onCheck,
    botThinking,
    canCheck,
}: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.instructionContainer}>
                <Text style={styles.instructionText}>{instruction}</Text>
            </View>

            <View style={styles.editorsContainer}>
                <View style={styles.userSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Tu respuesta</Text>
                        <TouchableOpacity
                            style={[styles.checkBtn, !canCheck && styles.checkBtnDisabled]}
                            onPress={onCheck}
                            disabled={!canCheck}
                        >
                            <Text style={styles.checkBtnText}>COMPROBAR</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.editorWrapper}>
                        <BlocklyEditor
                            toolboxConfig={toolboxConfig}
                            onCodeChange={onCodeChange}
                        />
                    </View>
                </View>

                <View style={styles.botSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>PhloBot</Text>
                        {botThinking && (
                            <View style={styles.thinkingBadge}>
                                <Text style={styles.thinkingText}>Pensando...</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.botPlaceholder}>
                        <Text style={styles.botEmoji}>🤖</Text>
                        <Text style={styles.botStatus}>
                            {botThinking ? 'Resolviendo...' : 'Esperando'}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    instructionContainer: {
        backgroundColor: '#F8F8F8',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    instructionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    editorsContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    userSection: {
        flex: 2,
        borderBottomWidth: 2,
        borderBottomColor: '#E0E0E0',
    },
    botSection: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F0F0F0',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    editorWrapper: {
        flex: 1,
    },
    botPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    botEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },
    botStatus: {
        fontSize: 14,
        color: '#888',
    },
    thinkingBadge: {
        backgroundColor: '#FF9600',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    thinkingText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    checkBtn: {
        backgroundColor: '#58CC02',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    checkBtnDisabled: {
        backgroundColor: '#CCC',
    },
    checkBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
});