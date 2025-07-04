# Import required libraries
import joblib
import numpy as np
import os
import pandas as pd
from datetime import datetime


class TemperatureModel:
    """Class for temperature prediction model"""
    def __init__(self):
        # Load model and scaler from saved files
        model_path = os.path.join(os.path.dirname(__file__), 'models', 'model_1.pkl')
        scaler_path = os.path.join(os.path.dirname(__file__), 'models', 'scaler_1.pkl')
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)

    def get_scaler(self):
        """Returns the scaler object"""
        return self.scaler

    def predict(self, input_data):
        """
        Make temperature predictions using the loaded model
        Args:
            input_data: Weather features for prediction
        Returns:
            float: Predicted temperature
        """
        input_data = pd.DataFrame(input_data, columns=['sealevelpressure', 'Evaporation', 'humidity', 'dew', 'temp', 'TomorrowTemp'])

        # scale the input data
        input_data_scaled = self.scaler.transform(input_data)

        # predict the output
        prediction_scaled = self.model.predict(input_data_scaled[:, :-1])

        # inverse transform the prediction
        prediction = float(self.scaler.inverse_transform(np.concatenate((input_data_scaled[:, :-1], prediction_scaled.reshape(-1, 1)), axis=1))[:, -1])

        return prediction


class RainModel:
    """Class for rain prediction model"""
    def __init__(self):
        # Load model from saved file
        model_path = os.path.join(os.path.dirname(__file__), 'models', 'model_2.pkl')
        self.model = joblib.load(model_path)

    def predict(self, input_data):
        """
        Make rain predictions using the loaded model
        Args:
            input_data: Weather features for prediction
        Returns:
            Binary prediction indicating rain (1) or no rain (0)
        """
        input_data = np.array(input_data).reshape(1, -1)
        return self.model.predict(input_data)[0]


class WeatherPatternModel:
    """Class for weather pattern prediction model"""
    def __init__(self):
        # Load model and scaler from saved files
        model_path = os.path.join(os.path.dirname(__file__), 'models', 'model_3.pkl')
        scaler_path = os.path.join(os.path.dirname(__file__), 'models', 'scaler_3.pkl')
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)

    def predict(self, input_data):
        """
        Make weather pattern predictions using the loaded model
        Args:
            input_data: Weather features for prediction
        Returns:
            Predicted weather pattern class
        """
        input_data = pd.DataFrame(input_data, columns=['temp', 'humidity', 'Evaporation', 'cloudcover', 'Rainfall'])

        # scale the input data
        input_data_scaled = self.scaler.transform(input_data)
        prediction = self.model.predict(input_data_scaled)
        
        return prediction

        
        
def load_weather_data(start_date=None, end_date=None):
    """
    Load and filter weather data from CSV file
    Args:
        start_date: Optional start date for filtering (YYYY-MM-DD)
        end_date: Optional end date for filtering (YYYY-MM-DD)
    Returns:
        pandas.DataFrame: Filtered weather data
    """
    data_path = os.path.join(os.path.dirname(__file__), 'models', 'melbourne_weather.csv')
    weather_data = pd.read_csv(data_path)

    # Convert date column to datetime
    weather_data["Date"] = pd.to_datetime(weather_data["Date"])
    temp_data = weather_data.dropna()

    # Filter data by date range if provided
    if start_date and end_date:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d")
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d")
        temp_data = temp_data[
            (temp_data["Date"] >= start_date_obj) &
            (temp_data["Date"] <= end_date_obj)
            ]

    return temp_data
