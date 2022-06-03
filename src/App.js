import "./App.css";
import { useEffect, useState } from "react";
import Clear from "./assets/clear.jpg";
import Cloudy from "./assets/cloudy.jpg";
import Overcast from "./assets/overcast.jpg";
import Rainy from "./assets/rainy.jpg";
import Snow from "./assets/snow.jpg";
import SearchIcon from "@mui/icons-material/Search";

function App() {
  const [place, setPlace] = useState("ghana");
  const [error, seterror] = useState("");
  const [placeInfo, setPlaceInfo] = useState("");

  const handleFetch = async () => {
    fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=153853fd2a5b4f91a5693121220605&q=${place}&days=1&aqi=no&alerts=no`
    )
      .then(async (response) => {
        let data = await response.json()
        if(data.error){
          setPlaceInfo("")
          return seterror(data.error.message)
        }
        setPlaceInfo({
          name: data.location.name,
          country: data.location.country,
          farenheit: {
            current: data.current.temp_f,
            high: data.forecast.forecastday[0].day.maxtemp_f,
            low: data.forecast.forecastday[0].day.mintemp_f,
          },
          condition: data.current.condition.text
        })
      })
  };

  useEffect(() => {
    handleFetch();
  }, [])

  return (
    <div className="app" style={
      placeInfo.condition?.toLowerCase() === "clear" ||
      placeInfo.condition?.toLowerCase() === "sunny"
        ? { backgroundImage: `url(${Clear})` }
        : placeInfo.condition?.includes("cloudy")
        ? { backgroundImage: `url(${Cloudy})` }
        : placeInfo.condition?.toLowerCase().includes("rainy")
        ? { backgroundImage: `url(${Rainy})` }
        : placeInfo.condition?.toLowerCase().includes("snow")
        ? { backgroundImage: `url(${Snow})` }
        : { backgroundImage: `url(${Overcast})` }
    }>
      <h3 className="heading">Gilgrey Weather Tracker</h3>
      <div className="search-input">
        <input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
        />
        <SearchIcon
          onClick={handleFetch}
          fontSize="medium"
          className="search-button"
        />
      </div>
      {
        placeInfo ? (
          <div className="weather-container">
            <div className="top-part">
              <h1>{placeInfo.farenheit?.current}° F</h1>
              <div className="condition-high-low">
                <h1>{placeInfo.condition}</h1>
                <h1>{placeInfo.farenheit.high}</h1>
                <h1>{placeInfo.farenheit.low}</h1>
              </div>
            </div>
            <h2>{placeInfo.name}, {placeInfo.country}</h2>
          </div>
        ) : (
          <p className="errorTx">{error}</p>
        )
      }
    </div>

  );
}

export default App
