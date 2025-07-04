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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { publicRequest } from "@/requestMethod";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function Component() {
  const [weatherData, setWeatherData] = useState<
    { name: string; value: number }[]
  >([]);
  const [dateRange, setDateRange] = useState({
    from: parseISO("2017-03-01"),
    to: parseISO("2017-06-25"),
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "/visualize/cluster";
        if (dateRange?.from && dateRange.to) {
          url += `?start_date=${format(
            dateRange.from,
            "yyyy-MM-dd"
          )}&end_date=${format(dateRange.to, "yyyy-MM-dd")}`;
        }
        const response = await publicRequest.get(url);
        const clusterData = response.data.cluster_by_date;

        // Count occurrences of each cluster
        const clusterCounts = Object.values(clusterData).reduce<{
          [key: number]: number;
        }>((acc, cluster) => {
          const clusterNum = cluster as number;
          acc[clusterNum] = (acc[clusterNum] || 0) + 1;
          return acc;
        }, {});

        // Transform cluster counts to pie chart format
        const transformedData = Object.entries(clusterCounts).map(
          ([cluster, count]): { name: string; value: number } => ({
            name:
              cluster === "0"
                ? "Hot and Dry"
                : cluster === "1"
                ? "Moderate Weather"
                : "Cool and Humid",
            value: count,
          })
        );

        setWeatherData(transformedData);
      } catch (error) {
        console.error("Error fetching weather pattern data:", error);
      }
    };

    fetchData();
  }, [dateRange]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-4`}>
      <Card className={isMobile ? "w-full" : "w-1/3"}>
        <CardHeader>
          <CardTitle>Filter Options</CardTitle>
          <CardDescription>
            Customize your weather distribution view
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full md:flex-1">
        <CardHeader>
          <CardTitle>Weather Distribution</CardTitle>
          <CardDescription>
            Distribution of weather types over selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={weatherData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={isMobile ? 100 : 150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {weatherData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
