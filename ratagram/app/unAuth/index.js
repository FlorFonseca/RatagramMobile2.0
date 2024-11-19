/**
 * Este es el login
*/


import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useToken } from "@/context/TokenContext";

export default () => {
  const { saveToken } = useToken();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => {
          saveToken("cualquier cosa");
          router.navigate("/");
        }}
      >
        <Text>Unauth</Text>
      </TouchableOpacity>
    </View>
  );
};
