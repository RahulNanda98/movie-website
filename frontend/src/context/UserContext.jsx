import { createContext, useState } from "react";

export const AuthContext = createContext(null);

export function UserContext({ children }) {
    const [user, setUser] = useState('');

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}