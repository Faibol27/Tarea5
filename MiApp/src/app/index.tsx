import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/hooks/use-auth";
import { tareasApi } from "@/service/api";
import { type Tarea } from "@/types/api";

export default function TareasScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      setTareas(await tareasApi());
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
  }, [logout, router]);

  const refrescar = useCallback(async () => {
    setRefreshing(true);
    await cargar();
    setRefreshing(false);
  }, [cargar]);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  const pendientes = tareas.filter((t) => !t.completada).length;

  const formatearFecha = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("es-DO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  if (loading) {
    return (
      <ThemedView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <ActivityIndicator size="large" />
        <ThemedText type="small" themeColor="textSecondary">
          Cargando tus tareas...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 50,
          paddingBottom: 12,
          gap: 14,
        }}
      >
        <View style={{ gap: 2 }}>
          <ThemedText type="subtitle">Mis tareas</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {tareas.length === 0
              ? "Sin tareas registradas"
              : `${tareas.length} en total · ${pendientes} pendiente${pendientes === 1 ? "" : "s"}`}
          </ThemedText>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable
            onPress={() => router.push("/crear")}
            style={({ pressed }) => ({
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              backgroundColor: "#0a0c0e",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#fff",
              paddingVertical: 12,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <ThemedText type="smallBold" style={{ color: "#fff" }}>
              Crear tarea
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={async () => {
              await logout();
              router.replace("/login");
            }}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 16,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <ThemedText type="smallBold" themeColor="textSecondary">
              Salir
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {error && (
        <Pressable
          onPress={cargar}
          style={{ paddingHorizontal: 24, paddingBottom: 12 }}
        >
          <View
            style={{
              backgroundColor: "#fee2e2",
              borderRadius: 8,
              padding: 12,
              gap: 4,
            }}
          >
            <ThemedText type="smallBold" style={{ color: "#b91c1c" }}>
              No se pudieron cargar tus tareas
            </ThemedText>
            <ThemedText type="small" style={{ color: "#b91c1c" }}>
              {error} · toca para reintentar
            </ThemedText>
          </View>
        </Pressable>
      )}

      <FlatList
        data={tareas}
        keyExtractor={(t) => String(t.id)}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 32,
          gap: 12,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refrescar}
            tintColor="#208AEF"
            colors={["#208AEF"]}
          />
        }
        ListEmptyComponent={
          error ? null : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <ThemedText type="default" style={{ fontWeight: "700" }}>
                Todavia no tienes tareas
              </ThemedText>
              <ThemedText
                type="small"
                themeColor="textSecondary"
                style={{ textAlign: "center" }}
              >
                Cuando se te asignen tareas apareceran aqui.
              </ThemedText>
            </View>
          )
        }
        renderItem={({ item }) => (
          <ThemedView
            type="backgroundElement"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              borderRadius: 12,
              padding: 16,
            }}
          >
            <View style={{ flex: 1, gap: 4 }}>
              <ThemedText
                type="default"
                style={{
                  fontWeight: "600",
                  textDecorationLine: item.completada ? "line-through" : "none",
                  opacity: item.completada ? 0.6 : 1,
                }}
              >
                {item.titulo}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Creada el {formatearFecha(item.creadoEn)}
              </ThemedText>
            </View>

            <View
              style={{
                borderRadius: 20,
                paddingVertical: 4,
                paddingHorizontal: 10,
                backgroundColor: item.completada
                  ? "rgba(47, 158, 68, 0.15)"
                  : "rgba(245, 159, 0, 0.15)",
              }}
            >
              <ThemedText
                type="smallBold"
                style={{ color: item.completada ? "#2f9e44" : "#b45309" }}
              >
                {item.completada ? "Completada" : "Pendiente"}
              </ThemedText>
            </View>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}
