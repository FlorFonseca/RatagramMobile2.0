import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getUsers = async () => {
  const token = await AsyncStorage.getItem("token");
  const usersFetch = await fetch("http://192.168.14.64:3001/api/user/all", {
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
  const navigation = useNavigation();

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
    navigation.navigate("FriendProfile", { userId });
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
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
            <Text style={{ padding: 10, fontSize: 16 }}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Dropdown;
