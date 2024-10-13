import React, { useState } from 'react';
import "./styles/submitEntrenamiento.css";
import { Container, Button, Alert, Table } from 'react-bootstrap';

export default function SubmitEntrenamiento() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState(null); 
  const [error, setError] = useState(null); 

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo primero.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); 

    try {
      const response = await fetch("http://localhost:8000/retrain", { 
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.statusText);
      }

      const data = await response.json();
      setResults(data.results); 
      setError(null); 
    } catch (err) {
      console.error(err);
      setError("Hubo un error al reentrenar el modelo. Intenta de nuevo."); 
    }
  };

  return (
    <Container>
      <h1>Reentrenamiento del modelo</h1>
      <h2>¿Cómo funciona?</h2>
      <p>
        Para reentrenar el modelo, sube un archivo .xlsx con los datos de entrenamiento.
        Asegúrate de que el archivo tenga la estructura correcta. Es decir, que tenga las columnas  
        necesarias para el entrenamiento del modelo. (Textos_espanol, sdg)
      </p>
      <h2>¿Qué hace el reentrenamiento?</h2>
      <p>
        En este caso, el modelo se va a reentrenar con los datos que subas. Lo que lo hará más preciso 
        en la predicción de los objetivos de desarrollo sostenible, suponiendo que cambiaste la estructura
        de los textos o algo relevante.
      </p>
      <h2>¡Advertencia!</h2>
      <p>
        Si subes un archivo con datos incorrectos o que no sigan la estructura correcta, el modelo podría
        no funcionar correctamente. Además, debes tener en cuenta que el proceso de reentrenamiento puede
        tardar un tiempo considerable, incluso media hora.
      </p>
      <h3>Sube un archivo Excel(.xlsx)</h3>
      <input type="file" accept=".xlsx" onChange={handleFileChange} data-label="Selecciona un Archivo" />
      <Button variant="primary" onClick={handleSubmit} className="upload-button">
        Subir archivo
      </Button>
      
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>} 

      {results && (
        <div className="mt-3">
          <h3>Resultados del reentrenamiento</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Label</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1-Score</th>
                <th>Support</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(results).filter((key) => !["accuracy", "macro avg", "weighted avg"].includes(key)).map((label) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{results[label].precision.toFixed(2)}</td>
                  <td>{results[label].recall.toFixed(2)}</td>
                  <td>{results[label]["f1-score"].toFixed(2)}</td>
                  <td>{results[label].support}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h3>Métricas globales</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Métrica</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Accuracy</td>
                <td>{results.accuracy.toFixed(2)}</td>
              </tr>
              {["macro avg", "weighted avg"].map((key) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>
                    Precision: {results[key].precision.toFixed(2)} <br />
                    Recall: {results[key].recall.toFixed(2)} <br />
                    F1-Score: {results[key]["f1-score"].toFixed(2)} <br />
                    Support: {results[key].support}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
}
