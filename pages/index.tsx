import { useState } from 'react';

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/weather?city=${city}`);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 flex-1"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button 
          className="bg-blue-500 text-white p-2 rounded"
          onClick={fetchWeather}
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </div>

      {weather && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">
            {weather.name} Weather
          </h2>
          <div className="flex items-center gap-4">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <div>
              <p className="text-4xl font-bold">
                {Math.round(weather.main.temp)}°C
              </p>
              <p className="text-gray-600">
                {weather.weather[0].description}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
            <div>
              <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
              <p>Pressure: {weather.main.pressure} hPa</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
