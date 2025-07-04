from fastapi import APIRouter, HTTPException
from fastapi.logger import logger
from schemas import WeatherPatternModelInput
from model import WeatherPatternModel, load_weather_data

router = APIRouter(prefix="/predict")
weather_pattern_model = WeatherPatternModel()


@router.post("/weather-type")
async def predict_weather_pattern(input: WeatherPatternModelInput):
    logger.info(f"Predicting weather pattern with input: {input.dict()}")
    try:
        input_data = [[
            input.temp,
            input.humidity,
            input.evaporation,
            input.cloudcover,
            input.rainfall
        ]]
        cluster = weather_pattern_model.predict(input_data)
        cluster_value = int(cluster)
        logger.info(f"Weather type cluster: {cluster_value}")
        return {"prediction": cluster_value}

    except Exception as e:
        logger.error(f"Error in weather pattern prediction: {str(e)}")
        raise HTTPException(status_code=500, detail="Model prediction error")