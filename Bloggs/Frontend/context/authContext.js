'use client'

import React, { useState, useContext } from "react"

const userContext = React.createContext(null);

const CurrentUser = ({ children }) => {
    const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('user');
            return stored ? stored : null;
        }
        return null;
    });

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    return (
        <userContext.Provider value={{ user, login, logout }}>
            {children}
        </userContext.Provider>
    )
}

export const useAuth = () => useContext(userContext);

export default CurrentUser;
