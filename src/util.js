// This is a utility file not a component
import React from "react"; 
import numeral from "numeral";
import {Circle, Popup} from "react-leaflet"; 

const casesTypeColors = {
    cases: {
      hex: "#CC1034",
      mulitiplier: 800,
    },
  
    recovered: {
      hex: "#7DD71D",
      mulitiplier: 1200,
    },
  
    deaths: {
      hex: "#C0C0C0",
      mulitiplier: 2000,
    },
  };


export const sortData = (data) => {
    const sortedData = [...data]; // Copy data on to new array
    
    // compares a to b and then wants -1 or 1 as comparator
    sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));

    return sortedData; 
}

// To draw the circles on the map
export const showDataOnMap = (data, casesType="cases") => (
    data.map(country => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType] / 10) *
                casesTypeColors[casesType].mulitiplier
            }
        >
            <Popup>
                <h1>I am a pop</h1>
            </Popup>
        </Circle>
    ))
);