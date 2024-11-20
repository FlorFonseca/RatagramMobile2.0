import { Stack } from "expo-router";

export default () => (
  <Stack>
    <Stack.Screen
      name="index"
      options={{ title: "Login", headerShown: false }}
    />
    <Stack.Screen
      name="register"
      options={{ title: "SignUp", headerShown: false }}
    />
  </Stack>
);
