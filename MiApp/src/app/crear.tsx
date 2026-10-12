import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/hooks/use-auth";
import { crearTareaApi } from "@/service/api";

export default function CrearTareaScreen() {
    const { logout } = useAuth();
    const router = useRouter();

    const [titulo, setTitulo] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCrear = async () => {
        if (loading) return;

        if (!titulo.trim()) {
            setError("Escribe un titulo para la tarea.");
            return;
        }

        setError(null);
        setLoading(true);
        try {
            await crearTareaApi(titulo.trim());
            router.back();
        } catch (e: any) {
            if (/token|sesion/i.test(e.message)) {
                await logout();
                router.replace("/login");
                return;
            }
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 8 }}>
                <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, alignSelf: "flex-start" })}>
                    <ThemedText type="linkPrimary">Volver</ThemedText>
                </Pressable>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }} keyboardShouldPersistTaps="handled">
                    <ThemedText type="title">Nueva tarea</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                        Escribe el titulo de la tarea que quieres agregar.
                    </ThemedText>

                    {error && (
                        <View style={{ backgroundColor: "#fee2e2", padding: 12, borderRadius: 8 }}>
                            <ThemedText type="small" style={{ color: "#b91c1c" }}>{error}</ThemedText>
                        </View>
                    )}

                    <TextInput
                        value={titulo}
                        onChangeText={setTitulo}
                        placeholder="Titulo de la tarea"
                        placeholderTextColor="#999"
                        maxLength={120}
                        style={{
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 8,
                            padding: 12,
                            color: "#ffffff",
                        }}
                    />

                    {loading ? (
                        <ActivityIndicator />
                    ) : (
                        <Pressable
                            onPress={handleCrear}
                            disabled={!titulo.trim()}
                            style={({ pressed }) => ({
                                backgroundColor: "#040505",
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: "#fff",
                                paddingVertical: 14,
                                alignItems: "center",
                                opacity: !titulo.trim() ? 0.5 : pressed ? 0.8 : 1,
                            })}
                        >
                            <ThemedText type="default" style={{ color: "#fff", fontWeight: "700" }}>
                                Guardar tarea
                            </ThemedText>
                        </Pressable>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}