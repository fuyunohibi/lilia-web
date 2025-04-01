"use client";

import { useEffect, useState } from "react";
import {
  CloudRain,
  Sun,
  Droplets,
  Wind,
  CloudSun,
  Moon,
  Cloud,
  Sunrise,
  Sunset,
} from "lucide-react";
import dayjs from "dayjs";
import PageWrapper from "@/components/layout.tsx/page-content";

const mockWeatherData = {
  name: "Bangkok",
  coord: {
    lon: 100.5167,
    lat: 13.75,
  },
  weather: [
    {
      id: 501,
      main: "Rain",
      description: "moderate rain",
      icon: "10d",
    },
  ],
  main: {
    temp: 284.2,
    feels_like: 282.93,
    temp_min: 283.06,
    temp_max: 286.82,
    pressure: 1021,
    humidity: 60,
    sea_level: 1021,
    grnd_level: 910,
  },
  wind: {
    speed: 4.09,
    deg: 121,
    gust: 3.47,
  },
  rain: {
    "1h": 2.73,
  },
  clouds: {
    all: 83,
  },
  sys: {
    country: "TH",
    sunrise: 1726636384,
    sunset: 1726680975,
  },
  timezone: 25200,
};

const WeatherPage = () => {
  const [weather, setWeather] = useState<typeof mockWeatherData | null>(null);

  useEffect(() => {
    // TODO: Replace with real fetch when API key is active in 1 hour
    setWeather(mockWeatherData);
  }, []);

  const convertKtoC = (k: number) => Math.round(k - 273.15);

  const getWeatherBackground = (main: string) => {
    switch (main.toLowerCase()) {
      case "rain":
        return "from-blue-300 to-blue-500";
      case "clouds":
        return "from-gray-300 to-gray-500";
      case "clear":
        return "from-yellow-200 to-orange-300";
      case "snow":
        return "from-slate-100 to-blue-200";
      case "thunderstorm":
        return "from-indigo-400 to-indigo-700";
      default:
        return "from-sky-100 to-blue-200";
    }
  };

  const renderWeatherIcon = (main: string) => {
    switch (main.toLowerCase()) {
      case "clear":
        return <Sun className="w-16 h-16 mx-auto text-yellow-400" />;
      case "clouds":
        return <CloudSun className="w-16 h-16 mx-auto text-gray-400" />;
      case "rain":
        return <CloudRain className="w-16 h-16 mx-auto text-blue-500" />;
      case "night":
        return <Moon className="w-16 h-16 mx-auto text-indigo-500" />;
      default:
        return <Sun className="w-16 h-16 mx-auto text-yellow-300" />;
    }
  };

  return (
    <PageWrapper className={`flex items-center justify-center rounded-xl p-6 bg-gradient-to-br ${getWeatherBackground(
          weather?.weather[0].main || ""
        )}`}>
        {weather && (
          <div className="bg-white rounded-3xl shadow-lg w-full max-w-sm p-6 text-center dark:bg-neutral-800">
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm text-gray-500">
                {weather.name}, {weather.sys.country}
              </p>
              <p className="text-xs text-gray-400">
                {dayjs().format("dddd, D MMMM")}
              </p>
            </div>

            <div className="my-6">
              {renderWeatherIcon(weather.weather[0].main)}
              <p className="text-5xl font-bold mt-2">
                {convertKtoC(weather.main.temp)}°C
              </p>
              <p className="text-gray-500 text-sm">
                {weather.weather[0].description}
              </p>
              <p className="text-xs text-gray-400">
                Feels like {convertKtoC(weather.main.feels_like)}°C
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex flex-col items-center">
                <Droplets className="w-5 h-5 mb-1" />
                <span>{weather.main.humidity}%</span>
                <span className="text-xs text-gray-400">Humidity</span>
              </div>
              <div className="flex flex-col items-center">
                <Wind className="w-5 h-5 mb-1" />
                <span>{weather.wind.speed} m/s</span>
                <span className="text-xs text-gray-400">Wind</span>
              </div>
              <div className="flex flex-col items-center">
                <Sunrise className="w-5 h-5 mb-1" />
                <span>{dayjs.unix(weather.sys.sunrise).format("HH:mm")}</span>
                <span className="text-xs text-gray-400">Sunrise</span>
              </div>
              <div className="flex flex-col items-center">
                <Sunset className="w-5 h-5 mb-1" />
                <span>{dayjs.unix(weather.sys.sunset).format("HH:mm")}</span>
                <span className="text-xs text-gray-400">Sunset</span>
              </div>
              <div className="flex flex-col items-center">
                <Cloud className="w-5 h-5 mb-1" />
                <span>{weather.clouds.all}%</span>
                <span className="text-xs text-gray-400">Clouds</span>
              </div>
              <div className="flex flex-col items-center">
                <CloudRain className="w-5 h-5 mb-1" />
                <span>{weather.rain["1h"]} mm</span>
                <span className="text-xs text-gray-400">Rain (1h)</span>
              </div>
            </div>
          </div>
        )}
    </PageWrapper>
  );
};

export default WeatherPage;
