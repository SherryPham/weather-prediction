import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  weatherSchema,
  type WeatherData,
} from "@/lib/schema/externalApi.schema";
import { createCurrentUrl } from "@/lib/weatherHelper";
import { format } from "date-fns";
import { Cloud, CloudRain, CloudSun } from "lucide-react";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return weatherSchema.parse(data);
};

export function CurrentWeather() {
  const url = createCurrentUrl("Melbourne");

  const { data, error } = useSWR<WeatherData>(url, fetcher);

  if (error) return <div>Failed to load weather data</div>;
  if (!data) {
    return (
      <Card className="p-6 rounded-lg shadow-sm">
        <div className="flex justify-center mb-4">
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>
        <div className="text-center">
          <Skeleton className="h-16 w-32 mx-auto mb-2" />
          <Skeleton className="h-6 w-48 mx-auto mb-4" />
          <div className="flex justify-center items-center mt-4 space-x-4">
            <div className="flex items-center">
              <Skeleton className="w-6 h-6 mr-2" />
              <Skeleton className="w-24 h-6" />
            </div>
            <div className="flex items-center">
              <Skeleton className="w-6 h-6 mr-2" />
              <Skeleton className="w-32 h-6" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const { current, location } = data;
  const localTime = new Date(location.localtime);

  return (
    <Card className="p-6 rounded-lg shadow-sm">
      <div className="flex justify-center mb-4">
        <Cloud className="w-32 h-32 text-blue-400" />
      </div>
      <div className="text-center">
        <h2 className="text-6xl font-bold">{Math.round(current.temp_c)}°C</h2>
        <p className="text-xl mt-2">
          {format(localTime, "EEEE")}, {format(localTime, "HH:mm")}
        </p>
        <div className="flex justify-center items-center mt-4 space-x-4">
          <div className="flex items-center">
            <CloudSun className="w-6 h-6 mr-2" />
            <span>{current.condition.text}</span>
          </div>
          <div className="flex items-center">
            <CloudRain className="w-6 h-6 mr-2" />
            <span>Humidity - {current.humidity}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
