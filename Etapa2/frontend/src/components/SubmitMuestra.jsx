import React, { useState } from 'react';
import "./styles/submitMuestra.css";
import { Container, Button, Table } from 'react-bootstrap';
import * as XLSX from 'xlsx';

export default function SubmitMuestra() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [predictionData, setPredictionData] = useState([]); 

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (selectedFile) {

      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          body: formData, 
        });
        
        const result = await response.json(); 
        
        const predictions = result.prediction;
        setPredictionData(predictions);

        const workbook = XLSX.read(await selectedFile.arrayBuffer(), { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setFileData(jsonData);

      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
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
              <th>Predicción</th> 
            </tr>
          </thead>
          <tbody>
            {fileData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
                <td>{predictionData[rowIndex] || "Cargando..."}</td> 
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
