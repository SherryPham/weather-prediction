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
import { cn } from "@/lib/utils";
import { publicRequest } from "@/requestMethod";
import { addDays, format, parseISO, subDays } from "date-fns";
import { CalendarIcon, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import useSWR from "swr";

export default function Chart2() {
  const [dateRange, setDateRange] = useState({
    from: parseISO("2017-06-17"),
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

  interface ProbabilityData {
    date: string;
    probability: number;
  }

  const { data: probabilityData = [], error } = useSWR<ProbabilityData[]>(
    [`/visualize/rain`, dateRange],
    async () => {
      const response = await publicRequest.get(`/visualize/rain`, {
        params: {
          start_date: format(dateRange.from, "yyyy-MM-dd"),
          end_date: format(dateRange.to, "yyyy-MM-dd"),
        },
      });
      return Object.entries(response.data.probability_by_date).map(
        ([date, probability]: [string, unknown]) => ({
          date,
          probability: probability as number,
        })
      );
    }
  );

  const handleZoom = (zoomIn: boolean) => {
    const currentRange = Math.ceil(
      (dateRange.to.getTime() - dateRange.from.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const newRange = zoomIn ? Math.max(2, currentRange - 2) : currentRange + 2;

    const midPoint = new Date(
      (dateRange.from.getTime() + dateRange.to.getTime()) / 2
    );
    const halfRange = Math.floor(newRange / 2);

    setDateRange({
      from: subDays(midPoint, halfRange),
      to: addDays(midPoint, halfRange),
    });
  };

  if (error) {
    console.error("Error fetching rain data:", error);
    return <div>Failed to load rainfall data</div>;
  }

  const filteredData = probabilityData.filter((data) => {
    const date = parseISO(data.date);
    return date >= dateRange.from && date <= dateRange.to;
  });

  return (
    <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-4`}>
      <Card className={isMobile ? "w-full" : "w-1/3"}>
        <CardHeader>
          <CardTitle>Filter Options</CardTitle>
          <CardDescription>Customize your rainfall chart view</CardDescription>
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
                      numberOfMonths={2}
                      fromDate={parseISO("2008-07-01")}
                      toDate={parseISO("2017-06-25")}
                    />
                  </PopoverContent>
                </Popover>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleZoom(true)}
                    className="flex-1"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleZoom(false)}
                    className="flex-1"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full md:flex-1">
        <CardHeader>
          <CardTitle>Rain Probability Distribution</CardTitle>
          <CardDescription>Daily rain probability over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              probability: {
                label: "Probability",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px] md:h-[500px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
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
                  domain={[0, 1]}
                  tick={{ fontSize: isMobile ? 12 : 14 }}
                  width={isMobile ? 30 : 40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} />
                <Bar
                  dataKey="probability"
                  fill="hsl(var(--chart-3))"
                  name="Rain Probability"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
