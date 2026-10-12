import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AuthProvider, useAuth } from '@/hooks/use-auth';

const PUBLICAS = ['login', 'registro'];

function Raiz() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const enPublica = PUBLICAS.includes(segments[0]);

    if (!user && !enPublica) {
      router.replace('/login');
    } else if (user && enPublica) {
      router.replace('/');
    }
  }, [user, isLoading, segments, router]);

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="registro" />
      <Stack.Screen name="crear" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Raiz />
      </AuthProvider>
    </ThemeProvider>
  );
}
