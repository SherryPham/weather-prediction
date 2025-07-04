import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  rainfall: z.number().min(0),
  evaporation: z.number().min(0),
  wind_gust_dir: z.number().min(0).max(10),
  wind_gust_speed: z.number().min(0),
  dew: z.number(),
  humidity: z.number().min(0).max(100),
  precip: z.number().min(0),
  sealevelpressure: z.number().min(0),
  cloudcover: z.number().min(0).max(100),
  rain_today: z.boolean(),
});

async function sendRequest(
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

export const RainPredictionModal = ({
  onResult,
  open,
  setOpen,
}: {
  onResult: Dispatch<SetStateAction<number | null>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { trigger, isMutating } = useSWRMutation("/predict/rain", sendRequest);
  const { trigger: getCurrentWeather, isMutating: isCurrentWeatherMutating } =
    useSWRMutation("/weather/current", fetchCurrentWeather);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rainfall: 0,
      evaporation: 0,
      wind_gust_dir: 10,
      wind_gust_speed: 0,
      dew: 0,
      humidity: 0,
      precip: 0,
      sealevelpressure: 1013,
      cloudcover: 0,
      rain_today: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await trigger(values);
      onResult(result.prediction);
      setOpen(false);
    } catch (error) {
      console.error("Prediction failed:", error);
    }
  };

  const handleAutoFill = async () => {
    try {
      const currentData = await getCurrentWeather();
      if (currentData) {
        form.reset({
          rainfall: 1, // external API doesn't provide rainfall data
          evaporation: 1, // external API doesn't provide evaporation data
          wind_gust_dir: 10,
          wind_gust_speed: currentData.current.gust_kph,
          dew: currentData.current.dewpoint_c,
          humidity: currentData.current.humidity,
          precip: currentData.current.precip_mm,
          sealevelpressure: currentData.current.pressure_mb,
          cloudcover: currentData.current.cloud,
          rain_today: currentData.current.precip_mm > 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch current weather:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rain Prediction Input</DialogTitle>
          <DialogDescription>
            Enter weather metrics to predict rain probability
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="wind_gust_dir"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wind Gust Direction</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wind_gust_speed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wind Gust Speed (km/h)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
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
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
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
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="precip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precipitation (mm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cloudcover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cloud Cover (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rain_today"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rain Today</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      value={field.value.toString()}
                    />
                  </FormControl>
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
