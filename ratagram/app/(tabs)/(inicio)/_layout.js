import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>

      <Stack.Screen name="index" options={{ title: "Feed" }} />
      <Stack.Screen
        name="PostDetails"
        options={{
          headerShown: true,
          title: "Detalles de Publicación",
        }}
      />
      <Stack.Screen name="friendProfile" options={{ headerShown: false }} />
      <Stack.Screen name="upload" options={{ title: "Upload Post" }} />

    </Stack>
  );
}

