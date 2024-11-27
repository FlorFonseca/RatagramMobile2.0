/*este*/
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useToken } from "@/context/TokenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchCommentsDetails = async (commentIds, token) => {
  return await Promise.all(
    (commentIds || []).map(async (commentId) => {
      if (!commentId) return null;
      const response = await fetch(
        `http://192.168.1.25:3001/api/posts/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        return await response.json();
      }
      return {
        _id: commentId,
        user: { username: "Usuario desconocido" },
        content: "Comentario no disponible",
      };
    })
  );
};

const handleAddLikes = async (id) => {
  try {
    const response = await fetch(
      `http://192.168.1.25:3001/api/posts/${id}/like`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.log("error en handleAddlikes");
  }
};

const handleDeleteLike = async (id) => {
  try {
    const response = await fetch(
      `http://192.168.1.25:3001/api/posts/${id}/like`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error al sacar el like");
    }

    return await response.json();
  } catch (error) {
    console.log("error en handleDeleteLikes");
  }
};

const Publicacion = ({
  id,
  username,
  userId,
  photo,
  description,
  Likes,
  Comments,
  isProfileView,
  onDelete,
}) => {
  const { token, userData } = useToken();
  const [likes, setLikes] = useState(Likes.length || 0);
  const [isAlreadyLiked, setIsAlreadyLiked] = useState(
    Likes.some((like) => like === userData._id)
  );
  const [commentInput, setCommentInput] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadComments = async () => {
      if (Comments && Comments.length > 0) {
        if (typeof Comments[0] === "string") {
          const commentsData = await fetchCommentsDetails(Comments, token);
          setComments(commentsData.filter((comment) => comment));
        } else {
          setComments(Comments);
        }
      }
    };
    loadComments();
  }, [Comments, token]);

  const handleLikeClick = async () => {
    if (isAlreadyLiked) {
      const dataPost = await handleDeleteLike(id);
      if (dataPost && dataPost.likes) {
        setLikes(dataPost.likes.length);
        setIsAlreadyLiked(false);
      }
    } else {
      const postData = await handleAddLikes(id);
      if (postData && postData.likes) {
        setLikes(postData.likes.length);
        setIsAlreadyLiked(true);
      }
    }
  };

  const profileRedirect = () => {
    if (userData && userId === userData._id) {
      router.push(`/(tabs)/MyProfile`);
    } else {
      router.push(`/(tabs)/(inicio)/friendProfile/${userId}`);
    }
  };

  const handleCommentSubmit = async () => {
    if (commentInput.trim() === "") return;

    try {
      const response = await fetch(
        `http://192.168.1.25:3001/api/posts/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: commentInput }),
        }
      );

      if (response.ok) {
        const commentData = await response.json();
        const fullCommentResponse = await fetch(
          `http://192.168.1.25:3001/api/posts/comments/${commentData._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (fullCommentResponse.ok) {
          const fullCommentData = await fullCommentResponse.json();
          setComments((prevComments) => [...prevComments, fullCommentData]);
          setCommentInput("");
        } else {
          console.error("Error al obtener los detalles del comentario");
        }
      } else {
        console.error("Error al crear el comentario");
      }
    } catch (error) {
      console.error("Error en handleCommentSubmit:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={profileRedirect}>
          <Text style={styles.username}>{username}</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: `http://192.168.1.25:3001/${photo}` }}
          style={styles.photo}
        />
        <Text style={styles.description}>{description}</Text>
        <TextInput
          value={commentInput}
          onChangeText={setCommentInput}
          placeholder="Escribe un comentario..."
          style={styles.commentInput}
        />
        {isProfileView && (
          <TouchableOpacity onPress={() => onDelete && onDelete(id)}>
            <Text style={styles.deleteButton}>Eliminar Publicación</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setShowComments(!showComments)}>
          <Text style={styles.commentsToggle}>
            {showComments ? "Ver menos" : "Ver más"}
          </Text>
        </TouchableOpacity>
        {showComments && (
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text>
                  @{item.user?.username || "Usuario desconocido"}:{" "}
                  {item.content}
                </Text>
              </View>
            )}
          />
        )}
        <View style={styles.buttons}>
          <TouchableOpacity onPress={handleLikeClick} style={styles.likeButton}>
            <Text>❤️ {likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCommentSubmit}>
            <Text>💬</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex:1,
  },
  container: {
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  username: { 
    fontWeight: "bold", 
    fontSize: 16 
  },
  photo: { 
    width: "100%", 
    height: 270, 
    marginVertical: 10,
    alignSelf: "center",
  },
  
  description: { 
    fontSize: 14 
  },
  commentInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginVertical: 10,
  },
  deleteButton: { color: "red", marginVertical: 10 },
  commentsToggle: { color: "#007BFF", marginVertical: 10 },
  comment: { padding: 5, borderBottomColor: "#ccc", borderBottomWidth: 1 },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  likeButton: { marginRight: 10 },
});

export default Publicacion;
