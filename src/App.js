import React, {useState, useEffect} from 'react';
import { sortData } from './util';

// Components 
import InfoBox from "./InfoBox"; 
import Map from "./Map";
import Table from "./Table"; 
import LineGraph from "./LineGraph"; 

//Importing css
import "./App.css";
import "leaflet/dist/leaflet.css";

//MaterialUI Dependencies
import {
  MenuItem,
  FormControl,
  Select, 
  Card,
  CardContent,
} from "@material-ui/core";

//Get Requests URLs list
const get_url_countries_data = "https://disease.sh/v3/covid-19/countries"
const get_url_all_countries_data = "https://disease.sh/v3/covid-19/all"


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]); 
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796}); //Center of pacific ocean
  const [mapZoom, setMapZoom] = useState(3); 
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  //useEffect = runs piece of code based on condition
  // ran once when component init 
  // or when state is changed of var
  useEffect(() => {
	  //For initial call to get worldwide data
	const getCountryInfo = () => {
		 fetch(get_url_all_countries_data)
			.then(res => res.json())
			.then(data => {
				setCountryInfo(data);
			});
	}
	getCountryInfo(); 
  }, [])

  useEffect(() => {
    //Define async function
    // Async function is basically waiting for promise to be fullfilled
    const getCountryData = async() => { // fetch is built in JS func for get reqs
      await fetch(get_url_countries_data) // await waits for the promise to be fullfilled
        .then((res) => res.json())
        .then((data) => { //Taking the JSON and then getting the specific info we want 
			const countries = data.map((country) => ({
				name: country.country,
				value: country.countryInfo.iso2,
			})).filter((country) => country.value !== null);

		  const sortedData = sortData(data); 
		  
          setCountries(countries); //Setting state to this country
		  setTableData(sortedData); //Getting the data for the table componenet
		  setMapCountries(data); 
        })
    } 
    getCountryData(); 
  }, []) //This function is only called once at the init of the component

  // When I click on the dropdown, make call 
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

	const url = countryCode === "worldwide" ? get_url_all_countries_data : // for worldwide and normal countries
		get_url_countries_data + "/" + countryCode
	
	await fetch(url)
		.then(res => res.json())
		.then(data => {
			setCountry(countryCode)
			setCountryInfo(data); // get JSON value 

			// Recenter map 
			if (countryCode === "worldwide") {
				setMapCenter({lat: 34.80746, lng: -40.4796});
				setMapZoom(3); 
			}
			else {
				setMapCenter({lat: data.countryInfo.lat, lng: data.countryInfo.long});
				setMapZoom(4); 
			}

			
		});
	
  }
  return (
    <div className="app"> {/* BEM naming convention component_element*/}
      
	  <div className="app_left">
		  {/* Title and Dropdown field */}
		  <div className="app_header">

		<h1>COVID-19 Tracker</h1> 

		<FormControl className="app_dropdown"> {/* This is like a drop down */}
		<Select variant="outlined" 
				value={country}
				onChange={onCountryChange}> 
			<MenuItem value="worldwide">Worldwide</MenuItem>
			{/* This loops through all the countries in state countries */}
			{countries.map(country => 
				<MenuItem value={country.value}>{country.name}</MenuItem>
			)}
		</Select>
		</FormControl>

		</div>

		{/* Infoboxes */}
		<div className="app_stats">
			{/* Infobox for Covid Cases*/}
			<InfoBox 
				active={casesType === "cases"}
				isRed={true}
				onClick={ev => setCasesType("cases")}
				title="Coronavirus Cases" 
				cases={countryInfo.todayCases} 
				total={countryInfo.cases}

			/>
			
			{/* Infobox for Covid Cases*/}
			<InfoBox 
				active={casesType === "recovered"}
				isRed={false}
				onClick={e => setCasesType("recovered")}
				title="Recovered" 
				cases={countryInfo.todayRecovered} 
				total={countryInfo.recovered}
			/>
			
			{/* Infobox for Covid Cases*/}
			<InfoBox 
				active={casesType === "deaths"}
				isRed={true}
				onClick={e => setCasesType("deaths")}
				title="Deaths" 
				cases={countryInfo.todayDeaths} 
				total={countryInfo.deaths}
				
			/>
		</div>

		{/* Map */}
		<Map 
			casesType={casesType}
			center={mapCenter} 
			zoom={mapZoom}
			countries={mapCountries}
		/>
	  </div>
      
      <Card className="app_right">
			<CardContent>
				<h3>Live Cases by Country</h3>

				<Table countries={tableData} />

				<h3 className={"app_graphTitle"}>Worldwide {casesType}</h3>
				<LineGraph classes={"app_graph"} casesType={casesType} /> 
			</CardContent>	  		
	  </Card>

    </div>
  );
}

export default App;
