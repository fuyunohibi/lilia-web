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
  Eye,
  Mountain,
  Waves,
  MapPin,
} from "lucide-react";
import dayjs from "dayjs";
import PageWrapper from "@/components/layout.tsx/page-content";

const WeatherPage = () => {
  const [weather, setWeather] = useState<any>(null);

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=13.7563&lon=100.5018&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  useEffect(() => {
    fetchWeather();
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
    <PageWrapper
      className={`flex items-center justify-center rounded-xl p-6 bg-gradient-to-br ${getWeatherBackground(
        weather?.weather[0].main || ""
      )}`}
    >
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
            <p className="text-gray-500 text-sm capitalize">
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
              <span>{weather.rain?.["1h"] || 0} mm</span>
              <span className="text-xs text-gray-400">Rain (1h)</span>
            </div>

            <div className="flex flex-col items-center">
              <Waves className="w-5 h-5 mb-1" />
              <span>{weather.main.sea_level || "—"} hPa</span>
              <span className="text-xs text-gray-400">Sea Level</span>
            </div>

            <div className="flex flex-col items-center">
              <Mountain className="w-5 h-5 mb-1" />
              <span>{weather.main.grnd_level || "—"} hPa</span>
              <span className="text-xs text-gray-400">Ground Level</span>
            </div>

            <div className="flex flex-col items-center">
              <Eye className="w-5 h-5 mb-1" />
              <span>{weather.visibility / 1000} km</span>
              <span className="text-xs text-gray-400">Visibility</span>
            </div>

            <div className="flex flex-col items-center col-span-3">
              <MapPin className="w-5 h-5 mb-1" />
              <span>
                Lat: {weather.coord.lat}, Lon: {weather.coord.lon}
              </span>
              <span className="text-xs text-gray-400">Coordinates</span>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default WeatherPage;
