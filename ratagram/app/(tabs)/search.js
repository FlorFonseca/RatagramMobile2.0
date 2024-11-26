import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs } from "expo-router";
import { useRouter } from "expo-router";
import friendProfile from "./(inicio)/friendProfile";

const getUsers = async () => {
  const token = await AsyncStorage.getItem("token");
  const usersFetch = await fetch("http://192.168.1.4:3001/api/user/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const users = await usersFetch.json();
  console.log(users);
  console.log("token (este token wachiin): " + token);
  return users;
};

const Dropdown = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  //const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      setUsers(users);
    };
    fetchUsers();
  }, []);

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
    router.push(`/friendProfile?friendId=${userId}`);
    console.log("Navegando al perfil de usuario con ID:", userId);
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
