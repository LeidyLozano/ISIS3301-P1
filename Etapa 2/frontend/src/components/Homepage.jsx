import React from 'react';
import { CustomNavbar } from './CustomNavbar';

export default function Homepage() {
  return (
    <div>

      <CustomNavbar nav_links={[
        { name: "Predecir una muestra", url: "/Muestra" },
        { name: "Reentrenar", url: "/Entrenamiento" }
      ]} />
      
      <h1>Homepage</h1>
    </div>
  );
}