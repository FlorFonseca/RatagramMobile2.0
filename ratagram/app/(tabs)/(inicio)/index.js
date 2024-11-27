import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Publicacion from "@/components/Publicacion";
import { router } from "expo-router";
import { useToken } from "@/context/TokenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyFeed() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const { token } = useToken();

  const handleFeed = async () => {
    try {
      const response = await fetch(
        "http://192.168.124.64:3001/api/posts/feed",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPosts(data || []);
      } else {
        setMessage(data.message || "Error al cargar el feed");
        if (response.status === 401) {
          await AsyncStorage.removeItem("token");
          router.push(`/unAuth`);
        }
      }
    } catch (error) {
      setMessage("Error en el servidor");
      Alert.alert("Error", "Error al cargar el feed");
      console.error("Error al cargar el feed: ", error);
    }
  };

  useEffect(() => {
    handleFeed();
  }, [posts]);

  const goToUpload = () => {
    router.push(`/(tabs)/(inicio)/upload`);
  };

  return (
    <SafeAreaView edges={["bottom"]} style={{flex:1}}>
      <View style={styles.feedContainer}>
        {message ? (
          <Text style={styles.message}>{message}</Text>
        ) : posts && posts.length > 0 ? (
          <FlatList
            data={posts.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )}
            keyExtractor={(post) => post._id}
            renderItem={({ item }) => (
              <Publicacion
                id={item._id}
                username={item.user.username}
                userId={item.user._id}
                refreshFeed={handleFeed}
                photo={item.imageUrl}
                description={item.caption}
                Likes={item.likes}
                Comments={item.comments}
              />
            )}
          />
        ) : (
          <Text style={styles.noPosts}>No hay publicaciones disponibles.</Text>
        )}

        <TouchableOpacity style={styles.floatingButton} onPress={goToUpload}>
          <MaterialIcons name="add-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  feedContainer: {
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,

  },
  message: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  noPosts: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "lightblue",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
