import React from 'react';
import { CustomNavbar } from './CustomNavbar';
import { Container } from 'react-bootstrap';
import SubmitMuestra from './SubmitMuestra'; // Import the default export

export default function Muestra() {
  return (
    <div>
      <CustomNavbar nav_links={[
        { name: "Predecir una muestra", url: "/Muestra" },
        { name: "Reentrenar", url: "/Entrenamiento" }
      ]} />
      <Container>
        <SubmitMuestra /> {/* Use the imported component directly */}
      </Container>
    </div>
  );
}