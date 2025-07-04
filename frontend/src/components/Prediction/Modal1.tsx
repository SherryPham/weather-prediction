import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { weatherSchema } from "@/lib/schema/externalApi.schema";
import { createCurrentUrl } from "@/lib/weatherHelper";
import { publicRequest } from "@/requestMethod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import * as z from "zod";

const formSchema = z.object({
  sealevelpressure: z
    .number()
    .min(800, "Must be at least 800 hPa")
    .max(1200, "Must be at most 1200 hPa"),
  evaporation: z
    .number()
    .min(0, "Must be at least 0 mm")
    .max(100, "Must be at most 100 mm"),
  humidity: z
    .number()
    .min(0, "Must be at least 0%")
    .max(100, "Must be at most 100%"),
  dew: z
    .number()
    .min(-50, "Must be at least -50°C")
    .max(50, "Must be at most 50°C"),
  temp: z
    .number()
    .min(-50, "Must be at least -50°C")
    .max(50, "Must be at most 50°C"),
});

async function predictTemperature(
  url: string,
  { arg }: { arg: z.infer<typeof formSchema> }
) {
  const response = await publicRequest.post(url, arg);
  return response.data;
}

async function fetchCurrentWeather() {
  const response = await publicRequest.get(createCurrentUrl("Melbourne"));
  return weatherSchema.parse(response.data);
}

export const TemperaturePredictionModal = ({
  onResult,
  open,
  setOpen,
}: {
  onResult: Dispatch<SetStateAction<number | null>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sealevelpressure: 1013,
      evaporation: 0,
      humidity: 60,
      dew: 0,
      temp: 0,
    },
  });

  const { trigger: getCurrentWeather, isMutating: isCurrentWeatherMutating } =
    useSWRMutation("/weather/current", fetchCurrentWeather);

  const { trigger, isMutating } = useSWRMutation(
    "/predict/temperature",
    predictTemperature
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await trigger(values);
      onResult(result.prediction);
      setOpen(false);
    } catch (error) {
      console.error("Failed to predict temperature:", error);
    }
  };

  const handleAutoFill = async () => {
    const currentData = await getCurrentWeather();
    if (currentData) {
      form.reset({
        sealevelpressure: currentData.current.pressure_mb,
        evaporation: currentData.current.precip_mm,
        humidity: currentData.current.humidity,
        dew: currentData.current.dewpoint_c,
        temp: currentData.current.temp_c,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Temperature Prediction Input</DialogTitle>
          <DialogDescription>
            Enter temperature and related metrics to predict tomorrow's
            temperature
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sealevelpressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sea Level Pressure (hPa)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="evaporation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evaporation (mm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="humidity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Humidity (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dew"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dew Point (°C)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="temp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature (°C)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleAutoFill}
                disabled={isCurrentWeatherMutating}
              >
                {isCurrentWeatherMutating ? "Loading..." : "Auto Fill"}
              </Button>
              <Button type="submit" disabled={isMutating}>
                {isMutating ? "Predicting..." : "Predict"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
