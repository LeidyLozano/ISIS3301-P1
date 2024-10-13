from typing import Optional

from fastapi import FastAPI, File, UploadFile
from joblib import load
from DataModelPredict import DataModelPredict
from DataModelTrain import DataModelTrain
from DataModelListPredict import DataModelListPredict
from DataModelListTrain import DataModelListTrain
import pandas as pd
from pipeline_classes import patch_main,retrain
import openpyxl 
from io import BytesIO


app = FastAPI()


patch_main()

@app.get("/")
def read_root():
   return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
   return {"item_id": item_id, "q": q}


@app.post("/predict")
async def make_predictions(file: UploadFile = File(...)):
    if file.content_type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return {"error": "Formato Invalido. Asegurese de subir un archivo Excel (.xlsx)"}
    
    contents = await file.read()
    df = pd.read_excel(BytesIO(contents)) 
    model = load("assets/model.joblib")
    result = model.predict(df)
    return {"prediction": result.tolist()}

@app.post("/retrain")
async def retrain_model(file: UploadFile = File(...)):
    if file.content_type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return {"error": "Formato Invalido. Asegurese de subir un archivo Excel (.xlsx)."}
    
    contents = await file.read()
    df = pd.read_excel(BytesIO(contents)) 
    results = retrain(df)
    return {"results": results}

