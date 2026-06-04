import LottieView from "lottie-react-native";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface GameOverModalProps {
    visible: boolean;
    onRetry: () => void;
    onHome: () => void;
}

export default function GameOverModal({
    visible,
    onRetry,
    onHome,
}: GameOverModalProps) {

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onHome}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <LottieView
                        source={require("../../assets/lottie/authAnimations/heart_broken_animation.json")}
                        autoPlay
                        loop
                        style={{ width: 300, height: 300 }}
                    />
                    <Text style={styles.title}>Perdiste</Text>
                    <Text style={styles.subtitle}>
                        Intenta de nuevo
                    </Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.buttonSecondary} onPress={onHome}>
                            <Text style={styles.buttonTextSecondary}>INICIO</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonPrimary} onPress={onRetry}>
                            <Text style={styles.buttonTextPrimary}>REINTENTAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        backgroundColor: "#fff",
        padding: 50,
        borderRadius: 50,
        alignItems: "center",
        margin: 20,
    },
    emoji: { fontSize: 60, marginBottom: 10 },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#58CC02",
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: "#777",
        textAlign: "center",
        marginBottom: 30,
        paddingHorizontal: 20,
        fontWeight: "600",
    },
    buttonRow: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        gap: 15,
    },
    buttonSecondary: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#E5E5E5",
        borderBottomWidth: 5,
        alignItems: "center",
    },
    buttonTextSecondary: {
        color: "#58CC02",
        fontWeight: "bold",
        fontSize: 16,
    },
    buttonPrimary: {
        // width: "20%",
        backgroundColor: "#58CC02",
        padding: 16,
        borderRadius: 16,
        borderBottomWidth: 5,
        borderBottomColor: "#46A302",
        alignItems: "center",
    },
    buttonTextPrimary: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    resendButton: {
        marginTop: 16,
        paddingVertical: 8,
    },
    resendText: {
        color: "#1CB0F6",
        fontWeight: "600",
        fontSize: 14,
    },
});
