import { Header } from "@/components/Header";
import { TemperaturePredictionModal } from "@/components/Prediction/Modal1";
import { RainPredictionModal } from "@/components/Prediction/Modal2";
import { WeatherTypeModal } from "@/components/Prediction/Modal3";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export default function Prediction() {
  const [temperaturePrediction, setTemperaturePrediction] = useState<
    number | null
  >(null);
  const [rainProbability, setRainProbability] = useState<number | null>(null);
  const [weatherCluster, setWeatherCluster] = useState<0 | 1 | 2 | null>(null);

  const [temperatureOpen, setTemperatureOpen] = useState(false);
  const [rainOpen, setRainOpen] = useState(false);
  const [weatherOpen, setWeatherOpen] = useState(false);

  return (
    <div className="h-full">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Prediction Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tomorrow's Temperature</CardTitle>
              <CardDescription>Linear Regression Model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {temperaturePrediction ? (
                <p className="text-2xl font-bold">{temperaturePrediction}°C</p>
              ) : (
                <p>Enter data to see prediction</p>
              )}
              <Button onClick={() => setTemperatureOpen(true)}>
                Enter Data
              </Button>
              <TemperaturePredictionModal
                onResult={setTemperaturePrediction}
                open={temperatureOpen}
                setOpen={setTemperatureOpen}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rain Prediction</CardTitle>
              <CardDescription>Classification Model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rainProbability ? (
                <p className="text-2xl font-bold">
                  {rainProbability > 0.5
                    ? "Likely to rain"
                    : "Unlikely to rain"}
                </p>
              ) : (
                <p>Enter data to see prediction</p>
              )}
              <Button onClick={() => setRainOpen(true)}>Enter Data</Button>
              <RainPredictionModal
                onResult={setRainProbability}
                open={rainOpen}
                setOpen={setRainOpen}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weather Type</CardTitle>
              <CardDescription>Clustering Model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {weatherCluster !== null ? (
                <p className="text-2xl font-bold">
                  {weatherCluster === 2
                    ? "Hot and Dry"
                    : weatherCluster === 1
                    ? "Hot and Humid"
                    : "Cool and Cloudy"}
                </p>
              ) : (
                <p>Enter data to see classification</p>
              )}
              <Button onClick={() => setWeatherOpen(true)}>Enter Data</Button>
              <WeatherTypeModal
                onResult={setWeatherCluster}
                open={weatherOpen}
                setOpen={setWeatherOpen}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
