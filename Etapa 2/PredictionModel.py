from joblib import load

class Model:

    def __init__(self,columns) -> None:
        self.model = load("assets/modelo.joblib")

    def make_predictions(self,data):
        result = self.model.predict(data)
        return result