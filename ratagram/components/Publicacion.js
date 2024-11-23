/*Publicaciones que se van a mostra:*/
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";

//Comentarios:
//añadir Likes:
//Borrar Likes:
//Falta lo de useAuth

const Publicacion = ({
  id,
  username,
  userId,
  photo,
  description,
  Likes,
  Comments,
  isProfileView,
  refreshFeed,
  onDelete,
  refreshComments,
}) => {
  return (
    <View style={styles.publicacion}>
      <View style={styles.publicacionContent}>
        <TouchableOpacity
          onPress={profileRedirect}
          style={styles.publicacionButtonUsername}
        >
          <Text>{username}</Text>
        </TouchableOpacity>
        <Image
          style={[styles.publicacionPhoto, { width: 250 }]}
          source={{ uri: photo }}
          resizeMode="cover"
        />
        <Text style={styles.publicacionDescription}>{description}</Text>
        <TextInput
          value={commentInput}
          onChangeText={(text) => setCommentInput(text)}
          placeholder="Escribe un comentario..."
          style={styles.commentInput}
        />
        {isProfileView && (
          <Button title="Eliminar Publicación" onPress={handleDeleteClick} />
        )}
        <Text
          style={styles.verComentarios}
          onPress={() => setShowComments(!showComments)}
        >
          {showComments ? "Ver menos" : "Ver más"}
        </Text>
        {showComments && (
          <View style={styles.publicacionComentarios}>
            {comments.map((comment) => (
              <View key={comment._id} style={styles.comment}>
                <Text>
                  @
                  {comment.user && comment.user.username
                    ? comment.user.username
                    : "Usuario desconocido"}
                  : {comment.content}
                </Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.publicacionWrappButtons}>
          <TouchableOpacity
            style={styles.publicacionLikeButton}
            onPress={handleLikeClick}
          >
            <Text>❤️ {likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.publicacionCommentButton}
            onPress={handleCommentSubmit}
          >
            <Text>💬</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  publicacion: {
    maxWidth: 600,
    marginVertical: 20,
    marginHorizontal: "auto",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  publicacionContent: {
    padding: 16,
  },
  publicacionButtonUsername: {
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#f1f1f1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  publicacionPhoto: {
    height: 250,
    maxHeight: 400,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  publicacionDescription: {
    fontSize: 14,
    color: "#333",
    marginVertical: 8,
  },
  commentInput: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    fontSize: 14,
  },
  verComentarios: {
    color: "#007BFF",
    textDecorationLine: "underline",
    marginVertical: 8,
  },
  publicacionComentarios: {
    marginVertical: 8,
  },
  comment: {
    marginVertical: 4,
  },
  publicacionWrappButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  publicacionLikeButton: {
    color: "#ff5a5f",
    fontSize: 16,
  },
  publicacionCommentButton: {
    color: "#ff5a5f",
    fontSize: 16,
  },
});

export default Publicacion;
