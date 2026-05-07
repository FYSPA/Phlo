import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface CodeViewerProps {
    code: string;
}

const highlightCode = (code: string) => {
    if (!code || code.trim() === '') {
        return <Text style={styles.comment}>// Empieza a conectar bloques...</Text>;
    }

    // Tokenizer básico usando Regex
    const tokenRegex = /(\/\/.*|'.*?'|".*?"|\b(?:var|let|const|if|else|for|while|function|return|true|false|new)\b|\b\d+(?:\.\d+)?\b|[{}[\]();=+\-*/<>!&|.,:])/g;
    const parts = code.split(tokenRegex);

    return parts.map((part, index) => {
        if (!part) return null;

        if (part.startsWith('//')) {
            return <Text key={index} style={styles.comment}>{part}</Text>;
        }
        if (part.startsWith("'") || part.startsWith('"')) {
            return <Text key={index} style={styles.string}>{part}</Text>;
        }
        if (/^(var|let|const|if|else|for|while|function|return|true|false|new)$/.test(part)) {
            return <Text key={index} style={styles.keyword}>{part}</Text>;
        }
        if (/^\d+(?:\.\d+)?$/.test(part)) {
            return <Text key={index} style={styles.number}>{part}</Text>;
        }
        if (/^[{}[\]();=+\-*/<>!&|.,:]$/.test(part)) {
            return <Text key={index} style={styles.operator}>{part}</Text>;
        }

        // Si no es ninguno de los anteriores, asume que es una variable/función/etc
        return <Text key={index} style={styles.normal}>{part}</Text>;
    });
};

export default function CodeViewer({ code }: CodeViewerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.macButtons}>
                    <View style={[styles.dot, { backgroundColor: '#FF5F56' }]} />
                    <View style={[styles.dot, { backgroundColor: '#FFBD2E' }]} />
                    <View style={[styles.dot, { backgroundColor: '#27C93F' }]} />
                </View>
                <Text style={styles.headerTitle}>JavaScript</Text>
            </View>
            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.codeContainer}>
                    {highlightCode(code)}
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '30%',
        backgroundColor: '#1E1E1E', // Estilo oscuro VSCode
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    header: {
        backgroundColor: '#2D2D2D',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#111',
    },
    macButtons: {
        flexDirection: 'row',
        marginRight: 15,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    headerTitle: {
        color: '#A0A0A0',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    codeContainer: {
        fontFamily: 'monospace',
        fontSize: 15,
        lineHeight: 24,
    },
    normal: { color: '#9CDCFE' },      // Estilo de variables en VS Code oscuro
    keyword: { color: '#569CD6', fontWeight: 'bold' },
    string: { color: '#CE9178' },
    number: { color: '#B5CEA8' },
    operator: { color: '#D4D4D4' },
    comment: { color: '#6A9955', fontStyle: 'italic' },
});
