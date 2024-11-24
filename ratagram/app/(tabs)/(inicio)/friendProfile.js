import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, Button } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToken } from "@/context/TokenContext";
import ProfilePublicacion from "./ProfilePublicacion";

const FriendProfile = () => {
  const { friendId } = useLocalSearchParams();
  const { token } = useToken();
  const router = useRouter();
  const [friendData, setFriendData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.35:3001/api/user/profile/${friendId}`,
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
          setIsFriend(data.isFriend || false);
        } else {
          const errorData = await response.json();
          console.error("Error en la respuesta:", errorData);
          setMessage("Error al cargar perfil.");
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        setMessage("Error en el servidor.");
      }
    };

    if (friendId) {
      fetchProfile();
    }
  }, [friendId, token]);

  const handlePostClick = async (post) => {
    try {
      // Guarda la publicación seleccionada en AsyncStorage
      await AsyncStorage.setItem("selectedPost", JSON.stringify(post));
      router.push({
        pathname: "/postDetails",
        params: {
          postId: post._id,
          username: friendData.username,
        },
      });
    } catch (error) {
      console.error("Error al guardar la publicación:", error);
    }
  };

  if (!friendData) {
    return (
      <View style={styles.center}>
        <Text>{message || "Cargando perfil..."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: friendData.profilePicture }} style={styles.profileImage} />
        <View>
          <Text style={styles.name}>{friendData.username}</Text>
          <Text>{friendData.friends?.length || 0} Amigos</Text>
        </View>
      </View>
      <Button
        title={isFriend ? "Eliminar amigo" : "Añadir amigo"}
        onPress={() => setIsFriend(!isFriend)}
        color={isFriend ? "#FF6347" : "#1E90FF"}
      />
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id || String(Math.random())}
        renderItem={({ item }) => (
          <ProfilePublicacion
            photo={item.imageUrl}
            description={item.caption}
            likes={item.likes.length}
            comments={item.comments.length}
            onPress={() => handlePostClick(item)}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay publicaciones</Text>}
      />
      {message && <Text>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginRight: 16 },
  name: { fontSize: 20, fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 16, color: "#777" },
});

export default FriendProfile;
