from pydantic import BaseModel, Field


class TemperatureModelInput(BaseModel):
    """Input schema for temperature prediction model
    
    Attributes:
        sealevelpressure: Sea level pressure in hPa, must be positive
        evaporation: Evaporation amount in mm, must be non-negative
        humidity: Relative humidity percentage between 0-100
        dew: Dew point temperature in Celsius between -50 and 50
        temp: Current temperature in Celsius between -50 and 50
    """
    sealevelpressure: float = Field(..., gt=0)
    evaporation: float = Field(..., ge=0)
    humidity: float = Field(..., ge=0, le=100)
    dew: float = Field(..., ge=-50, le=50)
    temp: float = Field(..., ge=-50, le=50)


class RainModelInput(BaseModel):
    """Input schema for rain prediction model
    
    Attributes:
        rainfall: Rainfall amount in mm, must be non-negative
        evaporation: Evaporation amount in mm, must be non-negative
        wind_gust_dir: Wind gust direction in degrees, must be non-negative
        wind_gust_speed: Wind gust speed in km/h, must be non-negative
        dew: Dew point temperature in Celsius between -50 and 50
        humidity: Relative humidity percentage between 0-100
        precip: Precipitation amount in mm, must be non-negative
        sealevelpressure: Sea level pressure in hPa, must be positive
        cloudcover: Cloud cover percentage between 0-100
        rain_today: Today's rainfall amount in mm, must be non-negative
    """
    rainfall: float = Field(..., ge=0)
    evaporation: float = Field(..., ge=0)
    wind_gust_dir: float = Field(..., ge=0)
    wind_gust_speed: float = Field(..., ge=0)
    dew: float = Field(..., ge=-50, le=50)
    humidity: float = Field(..., ge=0, le=100)
    precip: float = Field(..., ge=0)
    sealevelpressure: float = Field(..., gt=0)
    cloudcover: float = Field(..., ge=0, le=100)
    rain_today: float = Field(..., ge=0)


class WeatherPatternModelInput(BaseModel):
    """Input schema for weather pattern prediction model
    
    Attributes:
        temp: Temperature in Celsius between -50 and 50
        humidity: Relative humidity percentage between 0-100
        evaporation: Evaporation amount in mm, must be non-negative
        cloudcover: Cloud cover percentage between 0-100
        rainfall: Rainfall amount in mm, must be non-negative
    """
    temp: float = Field(..., ge=-50, le=50)
    humidity: float = Field(..., ge=0, le=100)
    evaporation: float = Field(..., ge=0)
    cloudcover: float = Field(..., ge=0, le=100)
    rainfall: float = Field(..., ge=0) 