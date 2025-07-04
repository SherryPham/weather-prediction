import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AstroData,
  astroSchema,
  weatherSchema,
  type WeatherData,
} from "@/lib/schema/externalApi.schema";
import { createAstroUrl, createCurrentUrl } from "@/lib/weatherHelper";
import { DropletsIcon, EyeIcon, SunIcon, WindIcon } from "lucide-react";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return weatherSchema.parse(data);
};

const fetcherAstro = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return astroSchema.parse(data.astronomy.astro);
};

export function Highlights() {
  const url = createCurrentUrl("Melbourne");
  const { data, error } = useSWR<WeatherData>(url, fetcher);

  const today = new Date().toISOString().split("T")[0];
  const urlAstro = createAstroUrl("Melbourne", today);
  const { data: dataAstro } = useSWR<AstroData>(urlAstro, fetcherAstro);

  if (error) return <div>Failed to load weather data</div>;
  if (!data) {
    return (
      <>
        <h3 className="text-2xl font-semibold mt-8 mb-4">Today's Highlights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="w-full">
              <CardContent className="p-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  const { current } = data;

  return (
    <>
      <h3 className="text-2xl font-semibold mt-8 mb-4">Today's Highlights</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="w-full">
          <CardContent className="p-4">
            <h4 className="text-lg font-semibold mb-2">UV Index</h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-bold">
                {current.uv}
              </span>
              <SunIcon className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="p-4">
            <h4 className="text-lg font-semibold mb-2">Wind Speed</h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-bold">
                {current.wind_kph}{" "}
                <span className="text-sm sm:text-base font-normal text-muted-foreground">
                  km/h
                </span>
              </span>
              <WindIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="p-4">
            <h4 className="text-lg font-semibold mb-2">Sunrise & Sunset</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <SunIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mr-2" />
                <span className="text-sm sm:text-base text-muted-foreground">
                  {dataAstro?.sunrise}
                </span>
              </div>
              <div className="flex items-center">
                <SunIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 mr-2" />
                <span className="text-sm sm:text-base text-muted-foreground">
                  {dataAstro?.sunset}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="p-4">
            <h4 className="text-lg font-semibold mb-2">Humidity</h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-bold">
                {current.humidity}
                <span className="text-sm sm:text-base font-normal">%</span>
              </span>
              <DropletsIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              {current.humidity < 30
                ? "Low"
                : current.humidity > 70
                ? "High"
                : "Normal"}
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="p-4">
            <h4 className="text-lg font-semibold mb-2">Visibility</h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-bold">
                {current.vis_km}{" "}
                <span className="text-sm sm:text-base font-normal text-muted-foreground">
                  km
                </span>
              </span>
              <EyeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent className="p-4">
            <h4 className="text-lg font-semibold mb-2">Air Quality</h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-bold">
                {current.air_quality?.["us-epa-index"] || "N/A"}
              </span>
              <WindIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
            </div>
            <p className="text-xs sm:text-sm text-red-500 mt-2">
              {current.air_quality && current.air_quality["us-epa-index"] > 3
                ? "Unhealthy"
                : "Good"}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
