import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import "./styles/submitMuestra.css";
import { Container, Button, Table } from 'react-bootstrap';

export default function SubmitMuestra() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [predictionData, setPredictionData] = useState([]); // New state for predictions

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Log the jsonData to inspect its structure
        console.log("jsonData:", jsonData);

        setFileData(jsonData);

        // Initialize predictions as placeholder data
        const predictions = jsonData.slice(1).map(() => "Fetching..."); // Placeholder, replace with actual API call
        setPredictionData(predictions);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  return (
    <Container>
      <h1>Predecir una muestra nueva de información</h1>
      <h3>Carga un nuevo archivo</h3>
      <input type="file" accept=".xlsx" data-label="Choose File" onChange={handleFileChange} />
      <Button variant="primary" className="upload-button" onClick={handleSubmit}>
        Subir archivo
      </Button>
      {fileData.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              {fileData[0].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
              <th>Predicción</th> {/* New column header for Prediction */}
            </tr>
          </thead>
          <tbody>
            {fileData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
                <td>{predictionData[rowIndex]}</td> {/* Placeholder prediction data */}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
