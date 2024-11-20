/**
 * Este es el login
 */
import React, { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useToken } from "@/context/TokenContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "react-native-elements";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { saveToken } = useToken();
  const { theme } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "Error al iniciar sesión",
        "Todos los campos son obligatorios"
      );
      return;
    }
    try {
      const response = await fetch("http://10.13.222.152:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        saveToken(data.token);
        //Alert.alert("Login", "Login exitoso" );
        router.push(`(tabs)/(inicio)`); //Para navegar al feed cuando lo tengamos
      } else {
        Alert.alert("Error", "Credenciales incorrectas");
      }
    } catch (error) {
      Alert.alert("Error", "Error en el servidor");
      console.log("error en la autenticación", error);
    }
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ThemedText style={styles.title}>Ratagram</ThemedText>

      <ThemedText style={styles.label}>Email</ThemedText>
      <TextInput
        style={[styles.input, { color: theme.colors.primary }]}
        value={email}
        onChangeText={setEmail}
        placeholder="Ingresa tu email"
        placeholderTextColor={theme.colors.grey0}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <ThemedText style={styles.label}>Password</ThemedText>
      <TextInput
        style={[styles.input, { color: theme.colors.primary }]}
        value={password}
        onChangeText={setPassword}
        placeholder="Ingresa tu contraseña"
        placeholderTextColor={theme.colors.grey0}
        secureTextEntry
      />

      <ThemedView style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <ThemedText style={styles.buttonText}>Login</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`/unAuth/register`)}
        >
          <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
