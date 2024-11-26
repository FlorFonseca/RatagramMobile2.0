/**Este sería el feed */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import Publicacion from "@/components/Publicacion";
import { router } from "expo-router";
import { useToken } from "@/context/TokenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function MyFeed() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const { token} = useToken();

  const handleFeed = async () => {
    try {
      const response = await fetch("http://192.168.1.4:3001/api/posts/feed", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  feedContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
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
});
