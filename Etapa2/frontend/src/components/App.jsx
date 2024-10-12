import React from "react";
import Homepage from "./Homepage";
import { Routes, Route } from "react-router-dom";
import Entrenamiento from "./Entrenamiento";
import Muestra from "./Muestra";
import "./styles/App.css";

export default function App() {

    const nav_links = [
        { url: "/", component: Homepage },
        { url: "/Entrenamiento", component: Entrenamiento },
        { url: "/Muestra", component: Muestra }

    ];

    return (
        <Routes>
            {nav_links.map((link, index) => (
                <Route key={index} path={link.url} element={<link.component />} />
            ))}
        </Routes>
    );
}