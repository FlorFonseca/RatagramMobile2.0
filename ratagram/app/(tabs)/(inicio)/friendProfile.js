import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfilePublicacion from "../../../components/ProfilePublicaciones";

const FriendProfile = () => {
  const { friendId } = useLocalSearchParams();
  console.log("friendId recibido:", friendId);

  const [friendData, setFriendData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(
          `http://192.168.1.4:3001/api/user/profile/${friendId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFriendData(data.user);
          setPosts(data.posts || []);
          setIsFriend(data.isFriend || false);
        } else {
          setMessage("Error al cargar el perfil.");
        }
      } catch (error) {
        setMessage("Error de red o del servidor.");
      }
    };

    if (friendId) fetchProfile();
  }, [friendId]);

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
        <View style={styles.profileHeader}>
          <View style={styles.profilePic}>
            {friendData.profilePicture ? (
              <Image
                source={{ uri: friendData.profilePicture }}
                style={styles.profileImage}
              />
            ) : (
              <Text>Sin imagen</Text>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.littleUserName}>{friendData.username}</Text>
            <Text style={styles.description}>
              {friendData.description || "Sin descripción"}
            </Text>
            <View style={styles.profileStats}>
              <Text>Posts: {posts.length}</Text>
              <Text>Friends: {friendData.friends?.length || 0}</Text>
            </View>
            <Button
              title={isFriend ? "Eliminar amigo" : "Añadir amigo"}
              onPress={() => setIsFriend(!isFriend)}
              color={isFriend ? "#FF6347" : "#1E90FF"}
            />
          </View>
        </View>
        <View style={styles.profilePosts}>
          {posts.length > 0 ? (
            <FlatList
              data={posts}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <ProfilePublicacion
                  photo={item.imageUrl}
                  description={item.caption}
                  likes={item.likes.length}
                  comments={item.comments.length}
                />
              )}
            />
          ) : (
            <Text>No hay publicaciones</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  profilePosts: {
    marginTop: 10,
  },
});

export default FriendProfile;
