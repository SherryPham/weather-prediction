import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  weatherSchema,
  type WeatherData,
} from "@/lib/schema/externalApi.schema";
import { createForecastUrl } from "@/lib/weatherHelper";
import axios from "axios";
import { format } from "date-fns";
import { LabelList, Line, LineChart, XAxis, YAxis } from "recharts";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const { data } = await axios.get(url);
  return weatherSchema.parse(data);
};

export function WeeklyForecast() {
  const url = createForecastUrl(7, "Melbourne");
  const { data, error } = useSWR<WeatherData>(url, fetcher);

  if (error) return <div>Failed to load forecast data</div>;
  if (!data) {
    return (
      <Tabs defaultValue="week">
        <TabsList>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
        </TabsList>
        <TabsContent value="week" className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <Card key={i} className="text-center p-2 sm:p-4">
                <Skeleton className="h-6 w-12 mx-auto mb-2" />
                <Skeleton className="h-10 w-10 mx-auto my-2 rounded-full" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="today" className="mt-4">
          <Card className="mb-4">
            <CardContent>
              <Skeleton className="h-[120px] w-full" />
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <Card key={i} className="text-center p-2 sm:p-4">
                <Skeleton className="h-6 w-12 mx-auto mb-2" />
                <Skeleton className="h-10 w-10 mx-auto my-2 rounded-full" />
                <Skeleton className="h-4 w-12 mx-auto" />
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    );
  }

  const currentHour = new Date().getHours();
  const hourlyData = data.forecast?.forecastday[0].hour
    .slice(currentHour, currentHour + 7)
    .map((hour) => ({
      hour: format(new Date(hour.time), "HH:mm"),
      temperature: hour.temp_c,
    }));

  const chartConfig = {
    temperature: {
      label: "Temperature",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Tabs defaultValue="week">
      <TabsList>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="today">Today</TabsTrigger>
      </TabsList>
      <TabsContent value="week" className="mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {data.forecast?.forecastday.map((forecast) => (
            <Card key={forecast.date} className="text-center p-2 sm:p-4">
              <h4 className="text-sm sm:text-base font-semibold">
                {format(new Date(forecast.date), "EEE")}
              </h4>
              <img
                src={`https:${forecast.day.condition.icon}`}
                alt={forecast.day.condition.text}
                className="w-8 h-8 sm:w-10 sm:h-10 mx-auto my-2"
              />
              <p className="text-xs sm:text-sm text-muted-foreground">{`${Math.round(
                forecast.day.mintemp_c
              )}°C - ${Math.round(forecast.day.maxtemp_c)}°C`}</p>
            </Card>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="today" className="mt-4">
        <Card className="mb-4">
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[120px] w-full">
              <LineChart
                accessibilityLayer
                data={hourlyData}
                height={100}
                margin={{
                  top: 20,
                  left: 12,
                  right: 12,
                }}
              >
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={0}
                />
                <YAxis
                  tickFormatter={(value) => value.toFixed(1)}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={["dataMin - 1", "dataMax + 1"]}
                  hide
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="temperature"
                  type="natural"
                  stroke="var(--color-temperature)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-temperature)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {data.forecast?.forecastday[0].hour.slice(0, 7).map((hour, index) => {
            const hourTime = new Date(hour.time);
            return (
              <Card key={index} className="text-center p-2 sm:p-4">
                <h4 className="text-sm sm:text-base font-semibold">
                  {format(hourTime, "HH:mm")}
                </h4>
                <img
                  src={`https:${hour.condition.icon}`}
                  alt={hour.condition.text}
                  className="w-8 h-8 sm:w-10 sm:h-10 mx-auto my-2"
                />
                <p className="text-xs sm:text-sm text-muted-foreground">{`${Math.round(
                  hour.temp_c
                )}°C`}</p>
              </Card>
            );
          })}
        </div>
      </TabsContent>
    </Tabs>
  );
}
