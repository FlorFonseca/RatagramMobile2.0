import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useToken } from "@/context/TokenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfilePublicacion from "@/components/ProfilePublicacion";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

export default function MyProfile() {
  const { token, userData } = useToken();
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postsStatistics, setPostsStatistics] = useState(0);
  const [friendsStatistics, setFriendsStatistics] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [message, setMessage] = useState("");
  const navigation = useNavigation();

  console.log(userData);
  console.log(AsyncStorage.getItem("token"));

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.25:3001/api/user/profile/${userData?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const DataUser = await response.json();
          setUserInfo(DataUser.user);
          setFriends(DataUser.user.friends);
          setPosts(DataUser.posts);
          setPostsStatistics(DataUser.posts.length);
          setFriendsStatistics(DataUser.user.friends.length);
          setNewUsername(DataUser.user.username);
          setNewProfilePicture(DataUser.user.profilePicture);
          setNewDescription(DataUser.user.description);
          setMessage("Perfil cargado");
        }
      } catch (error) {
        setMessage("Error en el servidor");
      }
    };

    handleProfile();
  }, [userData, token]); // Cambié la dependencia a `token`

  const handleOpenModal = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleEditProfile = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.25:3001/api/user/profile/edit`,
        {
          method: "PUT",
          body: JSON.stringify({
            username: newUsername,
            profilePicture: newProfilePicture,
            description: newDescription,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedData = await response.json();
        setUserInfo(updatedData.user);
        setIsEditing(false);
        setMessage("Perfil actualizado con éxito");
      } else {
        setMessage("Error al actualizar el perfil");
      }
    } catch (error) {
      setMessage("Error en el servidor");
    }
  };

  const handlePostClick = async (post) => {
    router.push({
      pathname: "/(tabs)/(inicio)/PostDetails",
      params: { post: JSON.stringify(post)},
    });
  };

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <ScrollView style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.profilePic}>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={newProfilePicture}
                onChangeText={setNewProfilePicture}
                placeholder="URL de la nueva imagen"
              />
            ) : userInfo?.profilePicture ? (
              <Image
                source={{ uri: userInfo.profilePicture }}
                style={styles.profileImage}
              />
            ) : (
              <Text>No Image</Text>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.littleUserName}>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={newUsername}
                  onChangeText={setNewUsername}
                />
              ) : (
                userInfo?.username
              )}
            </Text>
            <Text style={styles.description}>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={newDescription}
                  onChangeText={setNewDescription}
                  placeholder="Descripción"
                />
              ) : (
                userInfo?.description
              )}
            </Text>
            <View style={styles.profileStats}>
              <Text>Posts: {postsStatistics}</Text>
              <Text>Friends: {friendsStatistics}</Text>
            </View>
            <View style={styles.profileEditBtn}>
              {isEditing ? (
                <View style={styles.editButtonsContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleEditProfile}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonCancel]}
                    onPress={handleEditClick}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleEditClick}
                >
                  <Text style={styles.buttonText}>Editar perfil</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={styles.profilePosts}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <ProfilePublicacion
                key={post._id}
                photo={post.imageUrl}
                description={post.caption}
                likes={post.likes.length}
                comments={post.comments.length}
                onPress={() => handlePostClick(post)}
              ></ProfilePublicacion>
            ))
          ) : (
            <Text>No hay publicaciones</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  editButtonsContainer: {
    flexDirection: "row", // Organiza los botones en una columna
    alignItems: "center", // Centra los botones horizontalmente
    gap: 10, // Espaciado entre los botones (solo si tu versión de React Native soporta `gap`)
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  profileInfo: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 20,
  },
  littleUserName: {
    margin: 2,
    fontWeight: "bold",
    fontSize: 18,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginVertical: 10,
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  profileEditBtn: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007bff", // Color del botón
    paddingVertical: 10, // Altura del botón
    paddingHorizontal: 20, // Ancho del botón
    borderRadius: 5, // Bordes redondeados
    marginVertical: 5, // Espaciado entre los botones si `gap` no está disponible
  },
  buttonText: {
    color: "#fff", // Color del texto
    fontSize: 16,
    textAlign: "center",
  },
  profilePosts: {
    marginTop: 10,
    gap: 5,
  },
  userPublicacion: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
    height: "100%",
    width: "100%",
  },
});
