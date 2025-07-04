# Weather Prediction Project - Group ATC (79)

This project implements machine learning models for weather prediction using historical weather data from Melbourne, Australia. It includes data processing, model training, and prediction capabilities.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Environment Setup](#environment-setup)
3. [Data Preprocessing (Optional)](#data-preprocessing-optional)
4. [Model Training](#model-training)
5. [Making Predictions](#making-predictions)

## Project Structure

The project consists of the following main components:

- `COS30049_Data_processing.ipynb`: Data preprocessing and feature engineering
- `COS30049_Model_1.ipynb`: Average Temperature Prediction (Regression)
- `COS30049_Model_2.ipynb`: Rain or No Rain Prediction (Classification)
- `COS30049_Model_3.ipynb`: Weather Pattern Clustering
- `melbourne_weather.csv`: Final preprocessed dataset

## Environment Setup

To set up the project environment, follow these steps:

1. Ensure you have Python 3 installed on your system.

2. Ensure you have the source code and data files in the project directory.

3. Create a virtual environment:

   ```
   python -m venv venv
   ```

4. Activate the virtual environment:

   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```

   - Remember to configure jupyter notebook to use the virtual environment

5. Install the required packages:
   ```
   pip install numpy pandas matplotlib seaborn scikit-learn xgboost jupyter
   ```

## Data Preprocessing (Optional)

To preprocess the data:

1. Ensure you have the raw data file `weatherAUS.csv` in the project directory.

2. Run the data processing notebook:

   ```
   jupyter notebook COS30049_Data_processing.ipynb
   ```

3. Execute all cells in the notebook. This will generate the preprocessed dataset `melbourne_weather.csv`.

## Model Setup & Training

This project using Jupyter notebooks to train the models. The documentation have been provided detailing the steps to train the models.

### Model 1: Temperature Prediction

1. Open the notebook:

   ```
   jupyter notebook COS30049_Model_1.ipynb
   ```

2. Run all cells to train the Linear Regression model.

3. The trained model will be saved as `model_1.pkl`.

### Model 2: Rain Prediction

1. Open the notebook:

   ```
   jupyter notebook COS30049_Model_2.ipynb
   ```

2. Run all cells to train multiple classification models (Logistic Regression, XGBoost, Random Forest, Naive Bayes).

3. The best performing model (XGBoost) will be saved as `model_2.pkl`.

### Model 3: Weather Pattern Clustering

1. Open the notebook:

   ```
   jupyter notebook COS30049_Model_3.ipynb
   ```

2. Run all cells to perform K-means clustering and DBSCAN clustering.

3. The K-means model will be saved as `model_3.pkl`.

## Making Predictions

To make predictions using the trained models:

### Temperature Prediction

```python
import joblib

# Load the model
model = joblib.load('model_1.pkl')

# Prepare your input data (example)
input_data = [[1013.0, 2.0, 65, 10.5, 15.0]]  # [sealevelpressure, Evaporation, humidity, dew, temp]

# Make prediction
prediction = model.predict(input_data)
print(f"Predicted temperature for tomorrow: {prediction[0]:.2f}°C")
```

### Rain Prediction

```python
import joblib

# Load the model
model = joblib.load('model_2.pkl')

# Prepare your input data (example)
input_data = [[0.6,5.2,13,63.0,5.5,71.5,2.861,1014.6,80.6,0.0]]  # [Rainfall, Evaporation, WindGustDir, WindGustSpeed, dew, humidity, precip, sealevelpressure, cloudcover, RainToday]

# Make prediction
prediction = model.predict(input_data)
print(f"Rain prediction for tomorrow: {'Yes' if prediction[0] >= 0.5 else 'No'}")
```

### Weather Pattern Clustering

```python
import joblib

# Load the model
model = joblib.load('model_3.pkl')

# Prepare your input data (example)
input_data = [[15.0, 65, 2.0, 25, 1.0]]  # [temp, humidity, Evaporation, cloudcover, Rainfall]

# Make prediction
cluster = model.predict(input_data)
print(f"Weather pattern cluster: {cluster[0]}")
```
