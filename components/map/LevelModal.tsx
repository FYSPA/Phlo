import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from "react-native";

interface LevelModalProps {
  visible: boolean;
  onClose: () => void;
  onStart: () => void;
  levelNumber: number;
  levelTitle: string;
  isCompleted: boolean;
}

export default function LevelModal({
  visible,
  onClose,
  onStart,
  levelNumber,
  levelTitle,
  isCompleted,
}: LevelModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              {/* Drag indicator/handle */}
              <View style={styles.dragIndicator} />

              <View style={styles.header}>
                <Text style={styles.emoji}>{isCompleted ? "🏆" : "⚡"}</Text>
                <View
                  style={[
                    styles.badge,
                    isCompleted ? styles.badgeCompleted : styles.badgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      isCompleted ? styles.badgeTextCompleted : styles.badgeTextActive,
                    ]}
                  >
                    NIVEL {levelNumber}
                  </Text>
                </View>
              </View>

              <Text style={styles.title}>{levelTitle}</Text>
              
              <Text style={styles.description}>
                {isCompleted
                  ? "¡Nivel completado! Puedes volver a jugarlo para practicar y ganar más experiencia."
                  : "¡Aprende los conceptos fundamentales y pon a prueba tus habilidades!"}
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.buttonSecondary} onPress={onClose}>
                  <Text style={styles.buttonTextSecondary}>CERRAR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.buttonPrimary,
                    isCompleted ? styles.buttonCompleted : styles.buttonActive,
                  ]}
                  onPress={onStart}
                >
                  <Text style={styles.buttonTextPrimary}>
                    {isCompleted ? "PRACTICAR" : "EMPEZAR"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#E5E5E5",
    borderRadius: 3,
    marginBottom: 20,
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeActive: {
    backgroundColor: "#DDF4FF",
  },
  badgeCompleted: {
    backgroundColor: "#E8F5E9",
  },
  badgeText: {
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 1.2,
  },
  badgeTextActive: {
    color: "#1899D6",
  },
  badgeTextCompleted: {
    color: "#46A302",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3C3C3C",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#777777",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
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
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderBottomWidth: 5,
    alignItems: "center",
  },
  buttonTextSecondary: {
    color: "#AFAFAF",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonPrimary: {
    flex: 1.5,
    paddingVertical: 16,
    borderRadius: 16,
    borderBottomWidth: 5,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: "#1CB0F6",
    borderBottomColor: "#1899D6",
  },
  buttonCompleted: {
    backgroundColor: "#58CC02",
    borderBottomColor: "#46A302",
  },
  buttonTextPrimary: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
