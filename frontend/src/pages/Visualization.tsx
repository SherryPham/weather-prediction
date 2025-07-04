import { Header } from "@/components/Header";
import Chart1 from "@/components/Visulization/Chart1";
import Chart2 from "@/components/Visulization/Chart2";
import Chart3 from "@/components/Visulization/Chart3";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Visualization() {
  return (
    <div className="h-full">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="temperature">
          <TabsList>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="rainfall">Rainfall</TabsTrigger>
            <TabsTrigger value="weather-pattern">Weather</TabsTrigger>
          </TabsList>
          <TabsContent value="temperature">
            <div>
              <Chart1 />
            </div>
          </TabsContent>
          <TabsContent value="rainfall">
            <div>
              <Chart2 />
            </div>
          </TabsContent>
          <TabsContent value="weather-pattern">
            <div>
              <Chart3 />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
