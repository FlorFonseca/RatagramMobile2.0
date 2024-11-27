import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useToken } from "@/context/TokenContext";

const BottomTabLogout = () => {
  const { setToken, token } = useToken(); // Accede al contexto del token
  const [redirect, setRedirect] = useState(false); // Controla la redirección

  const handleLogout = () => {
    console.log("borrando el token" + token);
    AsyncStorage.removeItem("token")
      .then(() => {
        //setToken(null); // Limpia el token en el contexto
        console.log("token borrado: " + token);
        setRedirect(true); // Cambia el estado para redirigir
      })
      .catch((error) => {
        console.error("Error al borrar el token:", error);
      });
  };

  if (redirect) {
    // Redirige al usuario si se activó el estado de redirección
    return <Redirect href="/unAuth" />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tabButton} onPress={handleLogout}>
        <Text style={styles.tabText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomTabLogout;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: "#007BFF",
  },
});
