/**Este sería el feed */
import React, {useState, useEffect} from "react";
import { router } from "expo-router";
import {
  View,
  Image,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyFeed() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");

  const handleFeed = async () => {
    try {
      const response = await fetch ("http://localhost:3001/api/posts/feed", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      const data = await response.json();

      if (response.ok) {
        setPosts(data ||[]);
      } else {
        setMessage(data.message || "Error al cargar el feed");
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    } catch(error) {
      setMessage("Error en el servidor");
      console.error("Error al cargar el feed: ", error);
    }
  };

  useEffect(() => {
    handleFeed();
  }, []);

  return (
    <View style={styles.feedRatagram}>
      <Text style={styles.titulo}></Text>
      {message && <Text>{message}</Text>}
      {posts && posts.length > 0 ? (
        <FlatList
          data={posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
          keyExtractor={(item) => item.createdAt.toString()}
          renderItem={({ item: post }) => (
            <Publicacion
              key={post.createdAt}
              id={post._id}
              username={post.user.username}
              userId={post.user._id}
              refreshFeed={handleFeed}
              photo={post.imageUrl}
              description={post.caption}
              Likes={post.likes}
              Comments={post.comments}
            />
          )}
        />
      ) : (
        <Text style={styles.noPosts}>No hay publicaciones disponibles.</Text>
      )}
      <PersistentDrawerLeft />
    </View>
  );
};

const styles = StyleSheet.create({
  feedRatagram: {
    maxWidth: 600,
    marginHorizontal: 'auto',
    paddingVertical: 20,
    fontFamily: 'Arial',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  noPosts: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginTop: 10,
  },
});