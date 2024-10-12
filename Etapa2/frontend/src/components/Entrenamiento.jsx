import React from "react";
import { CustomNavbar } from "./CustomNavbar";
import SubmitEntrenamiento from "./SubmitEntrenamiento";

export default function Entrenamiento() {
    const nav_links = [
        { name: "Predecir una muestra", url: "/Muestra" },
        { name: "Reentrenar", url: "/Entrenamiento" },
    ];

    return (
        <div>
            <CustomNavbar nav_links={nav_links}/>
            <SubmitEntrenamiento/>
        </div>
    );
}