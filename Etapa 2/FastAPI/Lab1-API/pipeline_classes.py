# Manipulación y lectura de datos.
import pandas as pd
import numpy as np
import chardet

# Visualización
import matplotlib.pyplot as plt
from wordcloud import WordCloud, STOPWORDS
import seaborn as sns

# Herramientas de procesamiento de textos
import nltk
import unicodedata
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import SnowballStemmer
from sklearn.base import BaseEstimator, TransformerMixin

# Modelado del algoritmo.
from sklearn.model_selection import train_test_split,GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer, HashingVectorizer
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import KFold

#pipeline
from joblib import dump, load

nltk.download('stopwords')
nltk.download('punkt')
nltk.download('punkt_tab')

    
vectorizador = TfidfVectorizer()
modeloKNN = KNeighborsClassifier()
stemmer = SnowballStemmer('spanish')


class Preprocesamiento(BaseEstimator, TransformerMixin):
      def fit(self, X, y=None):
          return self

      def remove_non_ascii(self,words):
          """Remove non-ASCII characters from list of tokenized words"""
          new_words = []
          for word in words:
              new_word = unicodedata.normalize('NFKD', word).encode('ascii', 'ignore').decode('utf-8', 'ignore')
              new_words.append(new_word)
          return new_words

      def to_lowercase(self,words):
          """Convert all characters to lowercase from list of tokenized words"""
          new_words = []
          for word in words:
              new_word = word.lower()
              new_words.append(new_word)
          return new_words

      def remove_punctuation_and_numbers(self,words):
          """Remove punctuation and numbers from list of tokenized words, accounting for Spanish characters."""
          pattern = r'[!"#\$%&\'\(\)\*\+,\-\.\/:;<=>\?@\[\\\]\^_`\{\|\}~¿¡0-9]'
          new_words = []
          for word in words:
              new_word = re.sub(pattern, '', word)
              if new_word != '':
                  new_words.append(new_word)
          return new_words


      def remove_stopwords(self,words, stopwords=stopwords.words('spanish')):
          """Remove stop words from list of tokenized words"""
          new_words = []
          for word in words:
              if word not in stopwords:
                  new_words.append(word)
          return new_words

      def remove_numbers(self,words):
          """Remove all interger occurrences in list of tokenized words"""
          new_words = []
          for word in words:
              palabra = ''
              for char in word:
                  if not char.isdigit():
                      palabra = palabra + char
              if palabra != '':
                  new_words.append(palabra)
          return new_words

      def preprocessing(self, words):
          words = self.to_lowercase(words)
          words = self.remove_non_ascii(words)
          words = self.remove_numbers(words)
          words = self.remove_punctuation_and_numbers(words)
          words = self.remove_stopwords(words)
          return words

      def transform(self, X):
          X['Textos_espanol'] = X['Textos_espanol'].apply(word_tokenize)
          X['Textos_espanol'] = X['Textos_espanol'].apply(self.preprocessing)
          return X['Textos_espanol']


class stemificacion(BaseEstimator, TransformerMixin):

    def fit(self, X, y=None):
        return self

    def stem_words(self, words):
        words_list = []
        for word in words:
            words_list.append(stemmer.stem(word))
        return words_list

    def transform(self, token):
        token = token.apply(self.stem_words)
        token = token.apply(lambda x: ' '.join(x))
        return token
    
def patch_main():
    import __main__
    __main__.Preprocesamiento = Preprocesamiento
    __main__.stemificacion = stemificacion
    __main__.vectorizador = vectorizador
    __main__.modeloKNN = modeloKNN



def retrain(df):
    pipeline_data = df
    
    Y = pipeline_data['sdg']
    X = pipeline_data.drop(['sdg'], axis=1)
    X_train, X_test, Y_train, Y_test = train_test_split(X,Y, test_size=0.2, random_state=42)
    
    pipeline = Pipeline([
    ('preprocesamiento', Preprocesamiento()),
    ('stemificacion', stemificacion()),
    ('vectorizacion', vectorizador),
    ('modelo', modeloKNN)
    ])
    
    particiones = KFold(n_splits=10, shuffle=True, random_state = 0)
    grid_params = { 'modelo__n_neighbors' : [3,5,7],
               'modelo__weights' : ['uniform','distance'],
               'modelo__metric' : ['minkowski','euclidean','manhattan']}
    grid_searach = GridSearchCV(pipeline, grid_params, verbose=1, cv=particiones, n_jobs = -1)
    grid_searach = grid_searach.fit(X_train , Y_train)
    mejor_modelo = grid_searach.best_estimator_
    y_pred_test = mejor_modelo.predict(X_test)
    classification_rep = classification_report(Y_test, y_pred_test,output_dict=True)
    filename = 'assets/model.joblib'
    dump(mejor_modelo, filename)

    return classification_rep
    




