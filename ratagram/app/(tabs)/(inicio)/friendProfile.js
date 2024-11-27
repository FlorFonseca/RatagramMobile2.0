import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, StyleSheet, Button, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfilePublicacion from '@/components/ProfilePublicacion';

const FriendProfile = () => {
  const { friendId } = useLocalSearchParams();
  const [friendData, setFriendData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(
          `http://192.168.1.25:3001/api/user/profile/${friendId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFriendData(data.user);
          setPosts(data.posts || []);
          setFriends(data.user.friends || []);
          setIsFriend(data.isFriend || false);
        } else {
          setMessage("Error al cargar el perfil.");
        }
      } catch (error) {
        setMessage("Error en el servidor.");
      }
    };

    fetchProfile();
  }, [friendId]);

  const handlePostClick = async (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  if (!friendData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text>{message || "Cargando perfil..."}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Información del perfil */}
        <View style={styles.profileHeader}>
          <View style={styles.profilePic}>
            {friendData.profilePicture ? (
              <Image
                source={{ uri: friendData.profilePicture }}
                style={styles.profileImage}
              />
            ) : (
              <Text>No Image</Text>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{friendData.username}</Text>
            <Text style={styles.description}>
              {friendData.description || "Sin descripción"}
            </Text>
            <View style={styles.profileStats}>
              <Text>Posts: {posts.length}</Text>
              <Text>Friends: {friends.length}</Text>
            </View>
            <Button
              title={isFriend ? "Eliminar amigo" : "Añadir amigo"}
              onPress={() => setIsFriend(!isFriend)}
              color={isFriend ? "#FF6347" : "#1E90FF"}
            />
          </View>
        </View>

        {/* Lista de publicaciones */}
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ProfilePublicacion
              photo={item.imageUrl}
              description={item.caption}
              likes={item.likes.length}
              comments={item.comments.length}
              onPress={() => handlePostClick(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No hay publicaciones</Text>
          }
        />

        {/* Modal para publicación seleccionada */}
        {selectedPost && (
          <Modal
            visible={true}
            transparent={true}
            animationType="fade"
            onRequestClose={handleCloseModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Image
                  source={{
                    uri: `http://192.168.1.25:3001/${selectedPost.imageUrl}`,
                  }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedPost.caption}</Text>
                <Text style={styles.modalDetails}>
                  ❤️ Likes: {selectedPost.likes.length}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowComments(!showComments)}
                >
                  <Text style={styles.commentsToggle}>
                    💬 Comments: {selectedPost.comments.length}
                    {showComments ? "Ver menos" : "Ver más"}
                  </Text>
                </TouchableOpacity>
                {showComments && (
                  <FlatList
                    data={selectedPost.comments}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                      <View style={styles.comment}>
                        <Text>
                          @{item.user?.username || "Usuario desconocido"}:{" "}
                          {item.content || "Sin contenido"}
                        </Text>
                      </View>
                    )}
                  />
                )}
                <View style={styles.modalButtonContainer}>
                  <Button
                    title="Cerrar"
                    onPress={handleCloseModal}
                    color="#ff6347"
                  />
                </View>
              </View>
            </View>
          </Modal>
        )}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    marginLeft: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  empty: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  modalDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    textAlign: "center",
  },
  modalButtonContainer: {
    marginTop: 20,
    width: "100%",
  },
});

export default FriendProfile;
