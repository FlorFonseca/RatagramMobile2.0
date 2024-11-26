import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="friendProfile"
        options={{
          headerShown: true,
          title: "Perfil Amigo",
        }}
      />
      <Stack.Screen
        name="PostDetails"
        options={{
          headerShown: true,
          title: "Detalles de Publicación",
        }}
      />
    </Stack>
  );
}

