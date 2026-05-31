import MailRegisterModal from "@/components/auth/MailRegisterModal";
import ErrorPropsModal from "@/components/common/ErrorPropsModal";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { authService } from "../../../src/services/authService";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignUp() {
    if (!email || !password || !username) {
      setErrorMessage("Por favor llena todos los campos");
      setShowErrorModal(true);
      return;
    }

    setLoading(true);
    try {
      const data = await authService.signUp(email, password, username);
      console.log("[DEBUG] signUp result:", data);
      if (!data?.user) {
        setErrorMessage("No se pudo crear la cuenta. Intenta de nuevo.");
        setShowErrorModal(true);
      } else {
        setShowMailModal(true);
      }
    } catch (e: any) {
      setErrorMessage(e?.message || "Error al crear la cuenta");
      setShowErrorModal(true);
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Crea tu perfil</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <FontAwesome5
              name={showPassword ? "eye-slash" : "eye"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: "#58CC02", borderBottomColor: "#46A302" },
          ]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "CREANDO..." : "CREAR CUENTA"}
          </Text>
        </TouchableOpacity>
      </View>
      <MailRegisterModal
        visible={showMailModal}
        email={email}
        onResend={(email) => authService.resendConfirmationEmail(email)}
        onClose={() => {
          setShowMailModal(false);
          router.replace("/screens/auth/LoginScreen");
        }}
      />
      <ErrorPropsModal
        visible={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </KeyboardAvoidingView>
  );
}

// Estilos compartidos (puedes moverlos a un archivo aparte luego)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, padding: 24, justifyContent: "center" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4B4B4B",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#F7F7F7",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    borderBottomWidth: 4,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 20,
  },
});
