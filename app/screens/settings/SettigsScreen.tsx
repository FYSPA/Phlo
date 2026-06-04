import ErrorPropsModal from "@/components/common/ErrorPropsModal";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CardButton from "../../../components/cog/CardButton";
import { SignOutButton } from "../../../components/cog/SignOutButton";
import { authService } from "../../../src/services/authService";

export default function SettingsScreen() {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleSignOut() {
    try {
      await authService.signOut();
    } catch (error: any) {
      setErrorMessage(error.message ?? "Error al cerrar sesión");
      setShowErrorModal(true);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            router.back();
          }}
        >
          <FontAwesome5 name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Ajustes</Text>

        <CardButton
          title="Notificaciones"
          subtitle="Administra tus preferencias de notificación"
          icon="bell"
          onPress={() => {
            router.push("/screens/settings/NotificationsScreen");
          }}
        />
        <CardButton
          title="Privacidad"
          subtitle="Administra tus preferencias de privacidad"
          icon="lock"
          onPress={() => {
            router.push("/screens/settings/PrivacyScreen");
          }}
        />
        <CardButton
          title="Soporte"
          subtitle="Obtén ayuda con cualquier problema"
          icon="question-circle"
          onPress={() => {
            router.push("/screens/settings/SupportScreen");
          }}
        />
        <CardButton
          title="Acerca de"
          subtitle="Más información sobre la aplicación"
          icon="info-circle"
          onPress={() => {
            router.push("/screens/settings/AboutScreen");
          }}
        />

        <View style={styles.signOutContainer}>
          <SignOutButton onPress={handleSignOut} />
        </View>

        <ErrorPropsModal
          visible={showErrorModal}
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
    gap: 15,
    flexGrow: 1,
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000ff",
  },
  signOutContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
});
