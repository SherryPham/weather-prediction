import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { weatherSchema } from "@/lib/schema/externalApi.schema";
import { cn } from "@/lib/utils";
import { createForecastUrl } from "@/lib/weatherHelper";
import { publicRequest } from "@/requestMethod";
import axios from "axios";
import { addDays, format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import useSWR from "swr";

export default function Component() {
  const [dateRange, setDateRange] = useState({
    from: parseISO("2017-06-17"),
    to: parseISO("2017-06-25"),
  });
  const [showPrediction, setShowPrediction] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  interface TemperatureData {
    temperature: number;
    date: string;
  }

  const { data: tempData = [], error } = useSWR<TemperatureData[]>(
    [`/visualize/temperature`, dateRange, showPrediction],
    async () => {
      if (showPrediction) {
        // Get forecast data from weather API
        const forecastResponse = await axios.get(
          createForecastUrl(7, "Melbourne")
        );
        const forecastData = weatherSchema.parse(forecastResponse.data);

        // Send forecast data to backend for prediction
        const predictionResponse = await publicRequest.post(
          "/predict/next-week",
          {
            forecast_days: forecastData.forecast?.forecastday.map((fd) => ({
              day: fd.day,
            })),
          }
        );

        return predictionResponse.data.predictions.map(
          (temp: number, index: number) => ({
            temperature: temp,
            date: format(addDays(new Date(), index), "yyyy-MM-dd"),
          })
        );
      } else {
        const response = await publicRequest.get(`/visualize/temperature`, {
          params: {
            start_date: format(dateRange.from, "yyyy-MM-dd"),
            end_date: format(dateRange.to, "yyyy-MM-dd"),
          },
        });
        return response.data.chart_data.temperature_data;
      }
    }
  );

  // const handleZoom = (zoomIn: boolean) => {
  //   const currentRange = Math.ceil(
  //     (dateRange.to.getTime() - dateRange.from.getTime()) /
  //       (1000 * 60 * 60 * 24)
  //   );
  //   const newRange = zoomIn ? Math.max(2, currentRange - 2) : currentRange + 2;

  //   const midPoint = new Date(
  //     (dateRange.from.getTime() + dateRange.to.getTime()) / 2
  //   );
  //   const halfRange = Math.floor(newRange / 2);

  //   setDateRange({
  //     from: subDays(midPoint, halfRange),
  //     to: addDays(midPoint, halfRange),
  //   });
  // };

  if (error) return <div>Failed to load temperature data</div>;
  if (!tempData) return <div>Loading...</div>;

  return (
    <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-4`}>
      <Card className={isMobile ? "w-full" : "w-1/3"}>
        <CardHeader>
          <CardTitle>Filter Options</CardTitle>
          <CardDescription>
            Customize your temperature chart view
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Date Range</h3>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                      disabled={showPrediction}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={(range) => {
                        if (range?.from && range.to) {
                          const minDate = parseISO("2008-07-01");
                          const maxDate = parseISO("2017-06-25");
                          if (range.from >= minDate && range.to <= maxDate) {
                            setDateRange({ from: range.from, to: range.to });
                          }
                        }
                      }}
                      numberOfMonths={isMobile ? 1 : 2}
                      fromDate={parseISO("2008-07-01")}
                      toDate={parseISO("2017-06-25")}
                    />
                  </PopoverContent>
                </Popover>
                <div className="flex gap-2">
                  {/* <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleZoom(false)}
                    className="flex-1"
                    disabled={showPrediction}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleZoom(true)}
                    className="flex-1"
                    disabled={showPrediction}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button> */}
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowPrediction(!showPrediction)}
                >
                  {showPrediction
                    ? "Show Historical Data"
                    : "Show Next 7 Days Prediction"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full md:flex-1">
        <CardHeader>
          <CardTitle>Temperature Chart</CardTitle>
          <CardDescription>
            {showPrediction
              ? "Predicted temperature for next 7 days"
              : "Daily temperature over time"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              temp: {
                label: "Temperature",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px] md:h-[500px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={tempData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 5,
                  ...(isMobile ? {} : { right: 30, left: 20 }),
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    format(parseISO(date), isMobile ? "dd" : "MMM dd")
                  }
                  tick={{ fontSize: isMobile ? 12 : 14 }}
                  interval={isMobile ? 1 : 0}
                />
                <YAxis
                  tick={{ fontSize: isMobile ? 12 : 14 }}
                  width={isMobile ? 30 : 40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="hsl(var(--chart-1))"
                  name="Temperature (°C)"
                  strokeWidth={2}
                  dot={!isMobile}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
