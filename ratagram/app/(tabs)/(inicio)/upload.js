import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {useToken} from '@/context/TokenContext';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "react-native-elements";

export default function upload() {
  const [imageUri, setImageUri] = useState(null);
  const [caption, setCaption] = useState("");
  const {token}= useToken();
  const { theme } = useTheme();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const status = await ImagePicker.requestCameraPermissionsAsync();
    if (!status.granted) {
      Alert.alert("Se requiere acceso a la cámara");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUploadPost = async () => {
    if (!imageUri) {
      Alert.alert("Error", "Selecciona una imagen antes de publicar.");
      return;
    }

    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: "image.jpg",
      type: "image/jpeg",
    });
    formData.append("caption", caption);

    try {
      const response = await fetch(
        "http://192.168.1.25:3001/api/posts/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Post", "Tu publicación ha sido subida.");
        router.back(); 
      } else {
        Alert.alert(
          "Error",
          data.message || "No se pudo subir la publicación."
        );
      }
    } catch (error) {
      console.error("Error al subir la publicación:", error);
      Alert.alert("Error", "Hubo un problema al subir la publicación.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <ThemedText style={styles.buttonText}>Seleccionar imagen</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={takePhoto} style={styles.button}>
        <ThemedText style={styles.buttonText}>Toma una foto</ThemedText>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <TextInput
        placeholder="Escribe una descripción"
        placeholderTextColor={theme.colors.primary}
        value={caption}
        onChangeText={setCaption}
        style={[styles.input,{color: theme.colors.primary}]}
      />
      <TouchableOpacity onPress={handleUploadPost} style={styles.button}>
        <ThemedText style={styles.buttonText}>Publicar</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
  input: {
    width: "80%",
    padding: 10,
    margin: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007bff", 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 5, 
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
