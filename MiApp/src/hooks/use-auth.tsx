import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, TOKEN_KEY } from "@/service/api";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<{ token: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem(TOKEN_KEY)
            .then((token) => { if (token) setUser({ token }); })
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        const data = await loginApi(email, password);
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        setUser({ token: data.token });
    };

    const logout = async () => {
        await AsyncStorage.removeItem(TOKEN_KEY);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);