from typing import Optional

from fastapi import FastAPI
from joblib import load
from DataModelPredict import DataModelPredict
from DataModelTrain import DataModelTrain
from DataModelListPredict import DataModelListPredict
from DataModelListTrain import DataModelListTrain
import pandas as pd
from pipeline_classes import patch_main,retrain

app = FastAPI()


patch_main()

@app.get("/")
def read_root():
   return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
   return {"item_id": item_id, "q": q}


@app.post("/predict")
def make_predictions(dataModelList: DataModelListPredict):
    list = dataModelList.model_dump()["entries"]
    df = pd.DataFrame(list) 
    model = load("assets/model.joblib")
    result = model.predict(df)
    return {"prediction": result.tolist()}

@app.post("/retrain")
def retrain_model(dataModelList: DataModelListTrain):
    list = dataModelList.model_dump()["entries"]
    df = pd.DataFrame(list) 
    results = retrain(df)
    return {"results": results}

