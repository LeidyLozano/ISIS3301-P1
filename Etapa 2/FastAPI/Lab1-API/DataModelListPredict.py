from pydantic import BaseModel
from typing import List
from DataModelPredict import DataModelPredict

class DataModelListPredict(BaseModel):

# Estas varibles permiten que la librería pydantic haga el parseo entre el Json recibido y el modelo declarado.
    entries: List[DataModelPredict]
    #COMPLETAR CON LAS VARIABLES EXPLICATIVAS DE LOS DATOS DEL LABORATORIO 1

#Esta función retorna los nombres de las columnas correspondientes con el modelo exportado en joblib.
    def columns(self):
        return ["entries"]
