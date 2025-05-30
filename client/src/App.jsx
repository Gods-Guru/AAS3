import React from "react";
import AppRouter from "./AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/cartContext";

const App = () => {
    return (
        <CartProvider>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </CartProvider>
    );
};

export default App;