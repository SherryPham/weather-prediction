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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { weatherSchema } from "@/lib/schema/externalApi.schema";
import { createCurrentUrl } from "@/lib/weatherHelper";
import { publicRequest } from "@/requestMethod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import * as z from "zod";

const formSchema = z.object({
  temp: z.number().min(-50).max(50),
  humidity: z.number().min(0).max(100),
  evaporation: z.number().min(0),
  cloudcover: z.number().min(0).max(100),
  rainfall: z.number().min(0),
});

async function sendRequest(
  url: string,
  { arg }: { arg: z.infer<typeof formSchema> }
) {
  const response = await publicRequest.post(url, arg);
  return response.data;
}

async function fetchCurrentWeather() {
  const response = await axios.get(createCurrentUrl("Melbourne"));
  return weatherSchema.parse(response.data);
}

export const WeatherTypeModal = ({
  onResult,
  open,
  setOpen,
}: {
  onResult: Dispatch<SetStateAction<0 | 1 | 2 | null>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { trigger, isMutating } = useSWRMutation(
    "/predict/weather-type",
    sendRequest
  );
  const { trigger: getCurrentWeather, isMutating: isCurrentWeatherMutating } =
    useSWRMutation("/weather/current", fetchCurrentWeather);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      temp: 20,
      humidity: 50,
      evaporation: 0,
      cloudcover: 30,
      rainfall: 0,
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
          temp: currentData.current.temp_c,
          humidity: currentData.current.humidity,
          evaporation: 1.25, // external API doesn't provide evaporation data
          cloudcover: currentData.current.cloud,
          rainfall: currentData.current.precip_mm,
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
          <DialogTitle>Weather Type Classification</DialogTitle>
          <DialogDescription>
            Enter weather metrics to determine the weather type
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="evaporation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evaporation (mm)</FormLabel>
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
              name="rainfall"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rainfall (mm)</FormLabel>
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
                {isMutating ? "Classifying..." : "Classify"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
