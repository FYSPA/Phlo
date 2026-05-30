import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CardButtonProps {
    title: string;
    subtitle: string;
    icon: string;
    onPress: () => void;
}

export default function CardButton({ title, subtitle, icon, onPress }: CardButtonProps) {

    return (
        <TouchableOpacity style={styles.option} activeOpacity={0.7} onPress={onPress}>
            <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                    <FontAwesome5 name={icon as any} size={24} color="#242424" />
                </View>

                <View>
                    <Text style={styles.text}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
            </View>

            <FontAwesome5 name="chevron-right" size={14} color="#909090" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    option: {
        padding: 25,
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    iconContainer: {
        width: 45,
        height: 45,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: '#242424',
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 13,
        color: '#909090',
        fontWeight: '400',
        marginTop: 2,
    },
});
