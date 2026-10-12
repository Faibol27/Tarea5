import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { registroApi } from '@/service/api';
import { Colors } from '@/constants/theme';

export default function RegistroScreen() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState<'usuario' | 'admin'>('usuario');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRegistro = async () => {
        if (loading) return;
        setError(null);
        setLoading(true);
        try {
            await registroApi({ nombre: nombre.trim(), email: email.trim(), password, rol });
            router.replace('/login');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={{ gap: 16 }} keyboardShouldPersistTaps="handled">
                    <ThemedText type="title">Crear cuenta</ThemedText>

                    {error && (
                        <View style={{ backgroundColor: '#fee2e2', padding: 12, borderRadius: 8 }}>
                            <ThemedText style={{ color: '#b91c1c' }}>{error}</ThemedText>
                        </View>
                    )}

                    <TextInput
                        value={nombre}
                        onChangeText={setNombre}
                        placeholder="Nombre"
                        autoCapitalize="words"
                        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, color: "#fff" }}
                    />

                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, color: "#fff" }}
                    />

                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Contraseña"
                        secureTextEntry
                        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, color: "#fff" }}
                    />

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        {(['usuario', 'admin'] as const).map((r) => (
                            <Pressable
                                key={r}
                                onPress={() => setRol(r)}
                                style={{
                                    flex: 1,
                                    padding: 8,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: rol === r ? '#f7f8f8' : '#f7f8f8',
                                    backgroundColor: rol === r ? '#010102' : '#020101',
                                }}
                            >
                                <ThemedText
                                    style={{
                                        textAlign: 'center',
                                        color: rol === r ? '#fff' : "#888888",
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {r}
                                </ThemedText>
                            </Pressable>
                        ))}
                    </View>

                    {loading ? (
                        <ActivityIndicator />
                    ) : (
                        <Pressable onPress={handleRegistro}>
                            <ThemedText style={{ flexDirection: "row", textAlign: 'center', borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8 }} type="subtitle">Registrarme</ThemedText>
                        </Pressable>
                    )}

                    <ThemedText type="small" onPress={() => router.replace('/login')}>
                        Ya tienes cuenta? Inicia sesion
                    </ThemedText>
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}