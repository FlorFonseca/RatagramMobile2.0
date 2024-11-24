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
import { SafeAreaView } from "react-native-safe-area-context"; 
import { useToken } from "@/context/TokenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyProfile() {
  const { token, userData} = useToken();
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

  console.log(userData)
  console.log(AsyncStorage.getItem('token'))

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.6:3001/api/user/profile/${userData?._id}`,
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
          setNewProfilePicture(DataUser.user.profileImage);
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
        `http://192.168.1.6:3001/api/user/profile/edit`,
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            ) : userInfo?.profileImage ? (
              <Image
                source={{ uri: userInfo.profileImage }}
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
                <>
                  <Button title="Save" onPress={handleEditProfile} />
                  <Button title="Cancel" onPress={handleEditClick} />
                </>
              ) : (
                <Button title="Edit Profile" onPress={handleEditClick} />
              )}
            </View>
          </View>
        </View>
        <View style={styles.profilePosts}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <TouchableOpacity
                key={post.id}
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
  profileContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
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
    justifyContent: "flex-start",
    gap: 20,
    textAlign: "center",
    fontSize: 16,
  },
  profileEditBtn: {
    marginTop: 10,
  },
  editingBtn: {
    margin: 5,
  },
  profilePosts: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  userPublicacion: {
    width: "100%",
    paddingBottom: "100%",
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
  },
});