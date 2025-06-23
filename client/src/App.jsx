import React from "react";
import AppRouter from "./AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { StrictMode } from "react";
import {createRoot} from "react-dom/client"

createRoot(document.getElementById("root")).render(
<StrictMode>
        <CartProvider>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </CartProvider>
</StrictMode>
)
