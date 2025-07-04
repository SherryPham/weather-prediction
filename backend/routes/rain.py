from fastapi import APIRouter, HTTPException
from fastapi.logger import logger
from schemas import RainModelInput
from model import RainModel, load_weather_data

router = APIRouter(prefix="/predict")
rain_model = RainModel()


@router.post("/rain")
async def predict_rain(input: RainModelInput):
    logger.info(f"Predicting rain with input: {input.dict()}")
    try:
        input_data = [[
            input.rainfall,
            input.evaporation,
            input.wind_gust_dir,
            input.wind_gust_speed,
            input.dew,
            input.humidity,
            input.precip,
            input.sealevelpressure,
            input.cloudcover,
            input.rain_today
        ]]
        prediction = rain_model.predict(input_data)
        logger.info(f"Rain prediction value: {prediction}")
        return {"prediction": "Yes" if prediction >= 0.5 else "No"}

    except HTTPException as http_exc:
        logger.error(f"HTTP Exception: {http_exc.detail}")
        raise http_exc
    except Exception as e:
        logger.error(f"Error in the rain prediction: {str(e)}")
        raise HTTPException(status_code=500, detail="Model prediction error")