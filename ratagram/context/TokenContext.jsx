import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TokenContext = createContext();

export const useToken = () => useContext(TokenContext);

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // Cargar el token desde AsyncStorage al iniciar la app
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        console.log("Token cargado desde AsyncStorage:", storedToken);
        setToken(storedToken); // Actualizar el contexto con el token cargado
      } catch (error) {
        console.error("Error al cargar el token desde AsyncStorage:", error);
      }
    };

    loadToken();
  }, []);

  // Guardar el token en AsyncStorage y actualizar el contexto
  const saveToken = async (newToken) => {
    try {
      console.log("Guardando token en AsyncStorage:", newToken);
      await AsyncStorage.setItem("token", newToken); // Guardar el token en AsyncStorage
      setToken(newToken); // Actualizar el estado del contexto
      console.log("Token guardado y contexto actualizado.");
    } catch (error) {
      console.error("Error al guardar el token en AsyncStorage:", error);
    }
  };

  return (
    <TokenContext.Provider value={{ token, saveToken }}>
      {children}
    </TokenContext.Provider>
  );
};
