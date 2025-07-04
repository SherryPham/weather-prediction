from fastapi import APIRouter, HTTPException, Query
from fastapi.logger import logger
from datetime import datetime
import pandas as pd
from model import load_weather_data, RainModel, TemperatureModel, WeatherPatternModel

router = APIRouter(prefix="/visualize")
rain_model = RainModel()
temperature_model = TemperatureModel()
weather_pattern_model = WeatherPatternModel()


@router.get("/temperature")
async def visualize_temperature(
    start_date: str = Query(None, description="Start date in YYYY-MM-DD format"),
    end_date: str = Query(None, description="End date in YYYY-MM-DD format")
):
    try:
        weather_data = load_weather_data(start_date, end_date)
        formatted_data = [
            {"date": row["Date"], "temperature": row["temp"]}
            for _, row in weather_data.iterrows()
        ]
        
        return {"chart_data": {"temperature_data": formatted_data}}
    except Exception as e:
        logger.error(f"Error loading weather data: {str(e)}")
        raise HTTPException(status_code=500, detail="Error loading weather data")


@router.get("/rain")
async def get_rain_probability_distribution(start_date: str, end_date: str):
    logger.info(f"Getting rain probabilities from {start_date} to {end_date}")
    try:
        # Load weather data for date range
        weather_data = load_weather_data(start_date, end_date)

        if weather_data.empty:
            raise HTTPException(status_code=404, detail="No weather data found for given date range")

        # Prepare input data for prediction
        data_list = weather_data[[
            'Rainfall',
            'Evaporation',
            'WindGustDir',
            'WindGustSpeed',
            'dew',
            'humidity',
            'precip',
            'sealevelpressure',
            'cloudcover',
            'RainToday'
        ]].values

        # Get probability predictions
        probability_by_date = {}
        dates = weather_data['Date'].dt.strftime('%Y-%m-%d').tolist()

        for i, row in enumerate(data_list):
            # Reshape single row to 2D array for prediction
            input_row = row.reshape(1, -1)
            prob = rain_model.predict(input_row)
            probability_by_date[dates[i]] = round(float(prob), 3)

        logger.info(f"Calculated rain probabilities for {len(probability_by_date)} days")
        return {
            "probability_by_date": probability_by_date,
            "total_days": len(probability_by_date)
        }

    except HTTPException as http_exc:
        logger.error(f"HTTP Exception: {http_exc.detail}")
        raise http_exc
    except Exception as e:
        logger.error(f"Error getting rain probability distribution: {str(e)}")
        raise HTTPException(status_code=500, detail="Error analyzing rain probabilities")


@router.get("/cluster")
async def get_weather_pattern_distribution(start_date: str, end_date: str):
    logger.info(f"Getting weather pattern distribution from {start_date} to {end_date}")
    try:
        # Load weather data for date range
        weather_data = load_weather_data(start_date, end_date)

        if weather_data.empty:
            raise HTTPException(status_code=404, detail="No weather data found for given date range")

        # Prepare input data for prediction
        data_list = weather_data[[
            'temp',
            'humidity', 
            'Evaporation',
            'cloudcover',
            'Rainfall'
        ]]

        # Get cluster predictions
        outputs = weather_pattern_model.predict(data_list)
        dates = weather_data['Date'].dt.strftime('%Y-%m-%d').tolist()
        
        # Map predictions to dates
        cluster_by_date = {}
        for i, output in enumerate(outputs):
            cluster_by_date[dates[i]] = int(output)

        logger.info(f"Calculated weather patterns for {len(cluster_by_date)} days")
        return {
            "cluster_by_date": cluster_by_date,
            "total_days": len(cluster_by_date)
        }

    except HTTPException as http_exc:
        logger.error(f"HTTP Exception: {http_exc.detail}")
        raise http_exc
    except Exception as e:
        logger.error(f"Error getting weather pattern distribution: {str(e)}")
        raise HTTPException(status_code=500, detail="Error analyzing weather patterns")