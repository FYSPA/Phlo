import LottieView from "lottie-react-native";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ErrorPropsModalProps {
  visible: boolean;
  onClose: () => void;
  message?: string;
}

export default function ErrorPropsModal({
  visible,
  onClose,
  message,
}: ErrorPropsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <LottieView
            source={require("../../assets/lottie/authAnimations/error_animation.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.title}>Error</Text>
          <Text style={styles.subtitle}>{message}</Text>

          <TouchableOpacity style={styles.buttonPrimary} onPress={onClose}>
            <Text style={styles.buttonTextPrimary}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  content: {
    backgroundColor: "#fff",
    padding: 50,
    borderRadius: 50,
    alignItems: "center",
    margin: 20,
  },
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

  buttonPrimary: {
    width: "100%",
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
});
