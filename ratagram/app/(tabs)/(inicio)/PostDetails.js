import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const PostDetails = () => {
  const route = useRoute();
  const { post } = route.params;
 

  console.log("post",post);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Imagen del post */}
        <Image
          source={{ uri: `192.168.124.64:3001/${post.imageUrl}` }}
          style={styles.postImage}
        />

        {/* Información del post */}
        <Text style={styles.caption}>{post.caption}</Text>
        <Text style={styles.details}>
          Likes: {post.likes ? post.likes.length : 0} | Comentarios:{" "}
          {post.comments ? post.comments.length : 0}
        </Text>

        {/* Lista de comentarios */}
        <Text style={styles.commentsTitle}>Comentarios:</Text>
        <FlatList
          data={post.comments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <Text style={styles.commentUsername}>{item.username}:</Text>
              <Text style={styles.commentText}>{item.text}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noComments}>No hay comentarios</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  postImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 16,
  },
  caption: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  comment: {
    flexDirection: "row",
    marginBottom: 8,
  },
  commentUsername: {
    fontWeight: "bold",
    marginRight: 4,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
  },
  noComments: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
});

export default PostDetails;
