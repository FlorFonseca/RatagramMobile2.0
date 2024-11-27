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
import { Redirect } from "expo-router"; // Importa el componente Redirect

export default function MyProfile() {
  const { token, userData, setToken } = useToken();
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
  const [redirect, setRedirect] = useState(false); // Estado para redirigir

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const response = await fetch(
          `http://192.168.124.64:3001/api/user/profile/${userData?._id}`,
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
        `http://192.168.124.64:3001/api/user/profile/edit`,
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

  // Función de logout con redirección a /unAuth
  const handleLogout = () => {
    console.log("borrando el token" + token);
    //setToken(null);
    AsyncStorage.removeItem("token")
      .then(() => {
        //setToken(null);
        console.log("token borrado: " + token);
        setRedirect(true); // Establece el estado para redirigir
      })
      .catch((error) => {
        console.error("Error al borrar el token:", error);
      });
  };

  if (redirect) {
    return <Redirect href="/unAuth" />; // Redirige a /unAuth
  }

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
              <TouchableOpacity
                key={post._id}
                onPress={() => handleOpenModal(post)}
              >
                <View style={styles.userPublicacion}>
                  <Text>{post.title}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No hay publicaciones</Text>
          )}
        </View>
        {selectedPost && (
          <Modal visible={true} onRequestClose={handleCloseModal}>
            <Publicacion post={selectedPost} />
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoutContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  profileContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  editButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  profilePosts: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
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
