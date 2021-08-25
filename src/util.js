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

export const prettyPrintStat = (stat) => (
    stat? `${numeral(stat).format("0,0a")}` : "0"
);

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
                <div className="info-container">
                    {/* the url is the country's flag */}
                    <div 
                        className="info-flag"
                        style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                    />

                    {/* Country name */}
                    <div className="info-name">{country.country}</div>

                    {/* Number of Cases */}
                    <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>

                    {/* Number of Recovered */}
                    <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>

                    {/* Number of deaths */}
                    <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))
);