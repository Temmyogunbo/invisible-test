#!/usr/bin/env node
import axios from 'axios'; 
import fp from 'lodash/fp';

const targetDate = new Date();
const timestamp =
  targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60;

interface IWeatherObj {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface IWeather {
  coord: { lat: number; lon: number };
  weather: IWeatherObj[];
}

interface ILocationTime {
  dstOffset: number;
  rawOffset: number;
  status?: string;
  timeZoneId?: string;
  timeZoneName?: string;
}

export const getLocationWeather = async (location: string): Promise<IWeather> => {
  const URL = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHERAPIKEY}`;
  try {
    const response = await axios.get(URL);
    return { coord: response.data.coord, weather: response.data.weather };
  } catch (error) {
    console.log('An error occur when getting location weather', error);
  }
};

export const getLocationTime = async (location: {
  lat: number;
  lon: number;
}): Promise<ILocationTime> => {
  try {
    const googleurl = `https://maps.googleapis.com/maps/api/timezone/json?location=${
      location.lat
    },${location.lon}&timestamp=${timestamp}&key=${process.env.GOOGLEAPIKEY}`;
  
    const time = await axios.get(googleurl);
    return time.data;
  } catch (error) {
    console.log('An error occur when getting location time', error);
  }
}

export const computeOffset = (time: { dstOffset: number; rawOffset: number }): number => {
  const { dstOffset, rawOffset } = time;
  const offsets = dstOffset * 1000 + rawOffset * 1000;
  return offsets
}

export const computeLocalDate = (offsets: number): string => {
  const localdate = new Date(timestamp * 1000 + offsets);
  return localdate.toLocaleString();
}

export const computeTime = fp.compose(computeLocalDate, computeOffset);

export const printWeatherAndTime = async ([location, zipCode]: [string, number]) => {
  const {coord, weather} = await getLocationWeather(location);
  const time = await getLocationTime(coord);
  const computedTime = computeTime(time)
  console.log(`Your ${location} time and weather is ${computedTime}  and ${weather[0].description}`);
};

printWeatherAndTime(['california', 1020202]);
