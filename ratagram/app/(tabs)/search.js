import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useToken } from "@/context/TokenContext";

const getUsers = async (token) => {
  const response = await fetch("http://192.168.1.4:3001/api/user/all", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const users = await response.json();
  return users;
};

const Dropdown = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const router = useRouter();
  const { token, userData } = useToken(); // Obtenemos el token y los datos del usuario actual desde el contexto

  useEffect(() => {
    const fetchUsers = async () => {
      if (token) {
        const users = await getUsers(token);
        setUsers(users);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  const handleInputChange = (text) => {
    setSearchTerm(text);
  };

  const handleUserClick = (userId) => {
    console.log("ID actual del usuario:", userData?._id);
    console.log("ID del usuario clicado:", userId);

    if (userId === userData?._id) {
      // Si el ID del usuario coincide con el actual, navega a MyProfile
      console.log("Redirigiendo a MyProfile...");
      router.push("/(tabs)/MyProfile");
    } else {
      // De lo contrario, navega a FriendProfile
      console.log("Redirigiendo a FriendProfile...");
      router.push({
        pathname: "/(tabs)/(inicio)/friendProfile",
        params: { friendId: userId },
      });
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10,
              backgroundColor: "white",
              color: "black",
              paddingHorizontal: 8,
            }}
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChangeText={handleInputChange}
          />
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleUserClick(item._id)}>
                <Text style={{ padding: 10, fontSize: 16 }}>
                  {item.username}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Dropdown;
