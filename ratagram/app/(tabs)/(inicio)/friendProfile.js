import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FriendProfile = () => {
  const { friendId } = useLocalSearchParams();
  const [friendData, setFriendData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
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
      }
    };

    if (friendId) fetchProfile();
  }, [friendId]);

  if (!friendData) {
    return (
      <View style={styles.center}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: friendData.profilePicture }}
          style={styles.profileImage}
        />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginRight: 16 },
  name: { fontSize: 20, fontWeight: "bold" },
});

export default FriendProfile;
