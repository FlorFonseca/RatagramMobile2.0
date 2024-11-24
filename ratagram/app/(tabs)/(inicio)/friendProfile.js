/**
 * sería el friend profile, está dentro de la carpet de inicio ya que desde el feed se puede acceder a ella
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FriendProfile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del Amigo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
});

export default FriendProfile;
