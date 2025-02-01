// pages/index.tsx
import { useState, useEffect } from 'react';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

interface WeatherDataMap {
  [key: string]: WeatherData;
}

export default function Home() {
  const [cities, setCities] = useState(['Mumbai','New York', 'London', 'Tokyo', 'Paris', 'Boston', 'Jersey City']);
  const [weatherData, setWeatherData] = useState<WeatherDataMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const weatherPromises = cities.map(city =>
        fetch(`/api/weather?city=${city}`)
          .then(res => {
            if (!res.ok) throw new Error(`Failed to fetch weather for ${city}`);
            return res.json();
          })
      );
      const results = await Promise.all(weatherPromises);
      const newWeatherData: WeatherDataMap = {};
      results.forEach((data, index) => {
        newWeatherData[cities[index]] = data;
      });
      setWeatherData(newWeatherData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch weather data');
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWeather();
    const interval = setInterval(fetchAllWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-white text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Weather Dashboard</h1>
        
        <div className="flex flex-wrap gap-6 justify-center">
          {cities.map((city) => (
            <div 
              key={city}
              className="weather-card relative w-[300px] h-[400px] rounded-3xl overflow-hidden transition-all duration-500 hover:transform hover:scale-105"
            >
              {weatherData[city] && weatherData[city]?.weather?.[0] && (
                <>
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] to-[#203a43] opacity-90" />
                  <div 
                    className="weather-animation absolute inset-0" 
                    data-weather={weatherData[city]?.weather[0]?.main?.toLowerCase() || 'default'} 
                  />
                  
                  {/* Content Container */}
                  <div className="relative p-6 h-full flex flex-col">
                    {/* Temperature Section */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="text-7xl font-light tracking-tighter">
                          {Math.round(weatherData[city]?.main?.temp)}
                          <span className="text-3xl">°C</span>
                        </div>
                        <div className="text-gray-300 mt-2">
                          Feels like {Math.round(weatherData[city]?.main?.feels_like)}°C
                        </div>
                      </div>
                      
                      <div className="weather-icon-wrapper animate-bounce-slow">
                        <img 
                          src={`https://openweathermap.org/img/wn/${weatherData[city]?.weather[0]?.icon}@4x.png`}
                          alt={weatherData[city]?.weather[0]?.description}
                          className="w-24 h-24 filter drop-shadow-lg"
                        />
                      </div>
                    </div>

                    {/* City Info */}
                    <div className="mb-auto">
                      <h2 className="text-2xl font-semibold">{city}</h2>
                      <p className="text-gray-300 capitalize">
                        {weatherData[city]?.weather[0]?.description}
                      </p>
                    </div>

                    {/* Weather Details */}
                    <div className="grid grid-cols-3 gap-4 mt-6 bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                      <div className="text-center">
                        <div className="text-sm text-gray-300">Humidity</div>
                        <div className="text-lg font-semibold">
                          {weatherData[city]?.main?.humidity}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-300">Wind</div>
                        <div className="text-lg font-semibold">
                          {Math.round(weatherData[city]?.wind?.speed)} m/s
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-300">Pressure</div>
                        <div className="text-lg font-semibold">
                          {weatherData[city]?.main?.pressure}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
