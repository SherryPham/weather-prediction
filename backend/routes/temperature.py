from fastapi import APIRouter, HTTPException
from fastapi.logger import logger
from schemas import TemperatureModelInput
from model import TemperatureModel
from pydantic import BaseModel
import random
from typing import List

router = APIRouter(prefix="/predict")
temperature_model = TemperatureModel()


# Add this new model
class ForecastRequest(BaseModel):
    forecast_days: List[dict]


@router.post("/temperature")
async def predict_temperature(input: TemperatureModelInput):
    logger.info(f"Predicting temperature with input: {input.dict()}")
    try:
        input_data = [
            input.sealevelpressure,
            input.evaporation,
            input.humidity,
            input.dew,
            input.temp,
            input.temp
        ]
        prediction = temperature_model.predict([input_data])

        logger.info(f"Predicted temperature: {prediction}")
        return {"prediction": round(prediction, 2)}

    except HTTPException as http_exc:
        logger.error(f"HTTP Exception: {http_exc.detail}")
        raise http_exc
    except Exception as e:
        logger.error(f"Error in temperature prediction: {str(e)}")
        raise HTTPException(status_code=400, detail="Model prediction error")


@router.post("/next-week")
async def predict_next_week(request: ForecastRequest):
    logger.info("Predicting temperatures for next week")
    try:
        predictions = []
        forecast_days = request.forecast_days

        if not forecast_days:
            raise HTTPException(status_code=400, detail="Invalid forecast data format. Expected a list of daily forecasts")

        for forecast_day in forecast_days:
            try:
                # Validate required fields exist
                if "day" not in forecast_day:
                    raise HTTPException(status_code=400, detail="Missing daily forecast data")

                day_data = forecast_day["day"]
                input_data = [
                    random.randint(1000, 1005),          # sealevelpressure
                    day_data["totalprecip_mm"],       # using precipitation as proxy for evaporation
                    day_data["avghumidity"],          # average humidity
                    random.randint(-6, 6),           # dew point
                    day_data["avgtemp_c"],            # avg temp (instead of max)
                    day_data["avgtemp_c"]             # avg temp (instead of min)
                ]
                
                # Validate numeric values
                if not all(isinstance(x, (int, float)) for x in input_data):
                    raise HTTPException(status_code=400, detail="Invalid data type in forecast values")
                if input_data[2] < 0 or input_data[2] > 100:  # Validate humidity range
                    raise HTTPException(status_code=400, detail="Humidity must be between 0 and 100")
                    
                prediction = temperature_model.predict([input_data])
                predictions.append(round(prediction, 2))
                
            except KeyError as e:
                logger.error(f"Missing required forecast data field: {str(e)}")
                raise HTTPException(status_code=400, detail=f"Missing required forecast data field: {str(e)}")
        
        logger.info(f"Predicted temperatures for next week: {predictions}")
        return {"predictions": predictions}

    except HTTPException as he:
        logger.error(f"HTTP Exception: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Error in weekly temperature prediction: {str(e)}")
        raise HTTPException(status_code=400, detail="Model prediction error")