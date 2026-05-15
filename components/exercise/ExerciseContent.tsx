import React from 'react';
import { View, StyleSheet } from 'react-native';
import BlocklyEditor from '../map/BlocklyEditor';
import CodeViewer from './CodeViewer';

interface Props {
    showCode: boolean;
    currentCode: string;
    toolboxConfig: any;
    onCodeChange: (code: string) => void;
}

export default function ExerciseContent({ showCode, currentCode, toolboxConfig, onCodeChange }: Props) {
    return (
        <View style={styles.container}>
            {showCode && <CodeViewer code={currentCode} />}
            <BlocklyEditor
                toolboxConfig={toolboxConfig}
                onCodeChange={onCodeChange}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
});