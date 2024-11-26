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
import AsyncStorage from "@react-native-async-storage/async-storage";

const getUsers = async () => {
  const token = await AsyncStorage.getItem("token");
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
    router.push({
      pathname: "/friendProfile",
      params: { friendId: userId },
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1, padding: 20 }}>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10,
              paddingHorizontal: 8,
              backgroundColor: "white",
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
