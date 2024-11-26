import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

const PostDetails = () => {
  const { postId, username } = useLocalSearchParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const storedPost = await AsyncStorage.getItem("selectedPost");
        if (storedPost) {
          const parsedPost = JSON.parse(storedPost);
          if (parsedPost._id === postId) {
            setPost(parsedPost);
          } else {
            console.error("La publicación no coincide con el ID.");
          }
        } else {
          console.error("No se encontró la publicación almacenada.");
        }
      } catch (error) {
        console.error("Error al recuperar la publicación:", error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return (
      <View style={styles.center}>
        <Text>No se encontró la publicación.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: post.imageUrl }} style={styles.image} />
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.caption}>{post.caption}</Text>
      <Text style={styles.details}>Likes: {post.likes.length}</Text>
      <Text style={styles.details}>Comments: {post.comments.length}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 200, marginBottom: 16 },
  username: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  caption: { fontSize: 14, marginBottom: 8 },
  details: { fontSize: 12, color: "#555" },
});

export default PostDetails;