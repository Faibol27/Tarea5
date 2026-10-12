import { Tarea } from "@/types/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_KEY = "@miapp_token";
const BASE = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, "")

type Options = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    auth?: boolean;
}

export async function request<T>(path: string, { method = "GET", body, auth = false }: Options = {}): Promise<T> {
    const headers: Record<string, string> = { "Content-type": "application/json" };

    if (auth) {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (!token) throw new Error("Sin sesion activa");
        headers.Authorization = `Bearer ${token}`;
    }

    let res: Response;
    try {
        res = await fetch(`${BASE}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        })
    } catch {
        throw new Error("No se pudo conectar con el servidor");
    }

    const data = await res.json().catch(() => null)

    if (!res.ok) {
        throw new Error(data?.error() ?? `Error ${res.status}`);
    }
    return data as T;
}

export const loginApi = (email: string, password: string) =>
    request<{ token: string }>("/auth/login", { method: "POST", body: { email, password } });

export const registroApi = (datos: { nombre: string, email: string, password: string, rol: string }) =>
    request<{ id: number; nombre: string; rol: string }>("/auth/registro", { method: "POST", body: datos });

export const tareasApi = () => request<Tarea[]>("/v2/tareas", { auth: true });

export const crearTareaApi = (titulo: string) =>
    request<Tarea>("/v2/tareas", { method: "POST", auth: true, body: { titulo } });