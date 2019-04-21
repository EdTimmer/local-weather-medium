import React, { Component } from 'react';
import './App.css';
import moment from 'moment';

//please don't use my key, you can get your free key at https://openweathermap.org/appid
const API_KEY="5abd98ed849a5414b5960c496cc31a3d";

class App extends Component {
  state = {  
    city: undefined,
    country: undefined,  
    temperatureC: undefined,
    temperatureF: undefined,
    humidity: undefined,
    description: undefined,
    icon: undefined,
    sunrise: undefined,
    sunset: undefined,
    errorMessage: undefined,
  }

  componentDidMount() {

    if (navigator.geolocation) {

      //get coordinates
      this.getPosition()
      //then use coordinates to get weather data
      .then((position) => {      
        this.getWeather(position.coords.latitude, position.coords.longitude)
      })
      .catch((err) => {
        this.setState({ errorMessage: err.message });
      });

      //this part is not necessary, it is here to automatically update our weather data avery 5 minutes (300000 milliseconds)
      this.timerID = setInterval(
        () => this.tick(),
        300000
      );

    }
    else {
      alert("Geolocation not available")
    }
  }

  //function to get coordinates
  getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }
  
  //function to get weather if you have the coordinates
  getWeather = async (latitude, longitude) => { 
    const api_call = await fetch(`//api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const data = await api_call.json();
    console.log(data)
    this.setState({
      city: data.name,
      country: data.sys.country,
      temperatureC: Math.round(data.main.temp),
      temperatureF: Math.round(data.main.temp * 1.8 + 32),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      sunrise: moment.unix(data.sys.sunrise).format("hh:mm a"),
      sunset: moment.unix(data.sys.sunset).format("hh:mm a"),
    })
  }

  //function to re-run getting of coordinates followed by a re-run of fetching of weather data
  tick = () => {
    this.getPosition()
    .then((position) => {      
      this.getWeather(position.coords.latitude, position.coords.longitude)
    })
    .catch((err) => {
      this.setState({ errorMessage: err.message });
    });
  }

  //shut down auto updating if you will close this page and move on to another page in your app
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    if (this.state.city) {
      return (
        <div className="App">
  
          <div className="header-box">
            <div className="header">Here Comes The Sun</div>
          </div>   
          
          <div className="weather">
            <div className="weather-item">{this.state.city}, {this.state.country}</div>  
    
            <div className="weather-item">{this.state.temperatureC} &deg;C</div>
    
            <div className="weather-item">{this.state.temperatureF} &deg;F</div>
    
            <div className="weather-item">humidity {this.state.humidity}%</div>
    
            <div className="weather-item">{this.state.description}</div>
            <div>
              <img className="weather-icon" src={`http://openweathermap.org/img/w/${this.state.icon}.png`} alt="weather icon"/>
            </div>
            
    
            <div className="weather-item">
              <svg className="sun-icon" viewBox="0 0 24 24">
                <path fill="black" d="M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,16.3L15.82,19.41C16.21,19.8 16.21,20.43 15.82,20.82C15.43,21.21 14.8,21.21 14.41,20.82L12,18.41L9.59,20.82C9.2,21.21 8.57,21.21 8.18,20.82C7.79,20.43 7.79,19.8 8.18,19.41L11.29,16.3C11.5,16.1 11.74,16 12,16C12.26,16 12.5,16.1 12.71,16.3Z" />
              </svg>
              <span>{this.state.sunrise}</span>
            </div>
    
            <div className="weather-item">
              <svg className="sun-icon" viewBox="0 0 24 24">
                <path fill="black" d="M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,20.71L15.82,17.6C16.21,17.21 16.21,16.57 15.82,16.18C15.43,15.79 14.8,15.79 14.41,16.18L12,18.59L9.59,16.18C9.2,15.79 8.57,15.79 8.18,16.18C7.79,16.57 7.79,17.21 8.18,17.6L11.29,20.71C11.5,20.9 11.74,21 12,21C12.26,21 12.5,20.9 12.71,20.71Z" />
              </svg>
              <span>{this.state.sunset}</span>
            </div>
          </div>
                  

        </div>
      );      
    }
    else {
      return (
        <div>Loading...</div>
      )
    }    
  }
}

export default App;
