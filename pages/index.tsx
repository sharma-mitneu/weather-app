import { useState, useEffect } from 'react';

export default function Home() {
  const [cities, setCities] = useState(['New York', 'London', 'Tokyo', 'Paris']);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAllWeather = async () => {
    setLoading(true);
    const weatherPromises = cities.map(city => 
      fetch(`/api/weather?city=${city}`).then(res => res.json())
    );
    const results = await Promise.all(weatherPromises);
    const newWeatherData = {};
    results.forEach((data, index) => {
      newWeatherData[cities[index]] = data;
    });
    setWeatherData(newWeatherData);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllWeather();
  }, []);

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      weekday: 'long',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-[#0a1929] text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cities.map((city) => (
            <div key={city} className="bg-[#1a2937] rounded-lg p-6">
              {weatherData[city] && (
                <>
                  {/* Current Weather Section */}
                  <div className="mb-8">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="text-6xl font-light flex items-start">
                          {Math.round(weatherData[city].main.temp)}
                          <span className="text-2xl mt-1 ml-1">°C</span>
                        </div>
                        <div className="ml-4 mt-2">
                          <div className="text-xl capitalize">
                            {weatherData[city].weather[0].description}
                          </div>
                          <div className="text-sm text-gray-400">
                            {Math.round(weatherData[city].main.temp_max)}° 
                            {Math.round(weatherData[city].main.temp_min)}°
                          </div>
                        </div>
                      </div>
                      <img 
                        src={`https://openweathermap.org/img/wn/${weatherData[city].weather[0].icon}@2x.png`}
                        alt={weatherData[city].weather[0].description}
                        className="w-16 h-16"
                      />
                    </div>
                    <div className="mt-2">
                      <div className="text-lg">{city}</div>
                      <div className="text-sm text-gray-400">
                        {formatTime(weatherData[city].dt)}
                      </div>
                    </div>
                  </div>

                  {/* Additional Weather Info */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#0a1929] rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-400">Humidity</div>
                      <div className="text-xl">{weatherData[city].main.humidity}%</div>
                    </div>
                    <div className="bg-[#0a1929] rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-400">Wind</div>
                      <div className="text-xl">{Math.round(weatherData[city].wind.speed)} m/s</div>
                    </div>
                    <div className="bg-[#0a1929] rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-400">Pressure</div>
                      <div className="text-xl">{weatherData[city].main.pressure} hPa</div>
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
