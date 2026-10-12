import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/hooks/use-auth";

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (loading) return;
        setError(null);
        setLoading(true);
        try {
            await login(email.trim(), password);
            router.replace("/");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={{ flex: 1, justifyContent: "center", padding: 24, gap: 16 }}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView contentContainerStyle={{ gap: 16 }} keyboardShouldPersistTaps="handled">
                    <ThemedText type="title">Iniciar sesion</ThemedText>
                    {error && (
                        <View style={{ backgroundColor: '#fee2e2', padding: 12, borderRadius: 8 }}>
                            <ThemedText style={{ color: "#b91c1c" }}>{error}</ThemedText>
                        </View>
                    )}
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, color: "#fff" }}
                    />
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Contraseña"
                        secureTextEntry
                        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, color: "#fff" }}
                    />
                    {loading ? <ActivityIndicator /> : (
                        <Pressable onPress={handleLogin}>
                            <ThemedText style={{ flexDirection: "row", textAlign: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8 }} type="subtitle">Entrar</ThemedText>
                        </Pressable>
                    )}
                    <ThemedText type="small" onPress={() => router.push("/registro")}>
                        No tienes cuenta? Registrate
                    </ThemedText>
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView >
    )
}