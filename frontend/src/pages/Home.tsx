import { Header } from "@/components/Header";
import { CityCard } from "@/components/Home/CityCard";
import { CurrentWeather } from "@/components/Home/CurrentWeather";
import { Highlights } from "@/components/Home/Highlights";
import { SearchBar } from "@/components/Home/SearchBar";
import { WeeklyForecast } from "@/components/Home/WeeklyForecast";

export default function Home() {
  return (
    <div className="h-full">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <SearchBar />
            </div>
            <CurrentWeather />
            <CityCard />
          </div>

          <div className="lg:col-span-2">
            <WeeklyForecast />
            <Highlights />
          </div>
        </div>
      </main>
    </div>
  );
}
