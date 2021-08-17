import React, {useState, useEffect} from 'react';
import "./App.css";
import InfoBox from "./InfoBox"; 
import Map from "./Map";

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
  const [countryInfo, setCountryInfo] = useState()

  //useEffect = runs piece of code based on condition
  // ran once when component init 
  // or when state is changed of var
  useEffect(() => {
    //Define async function
    // Async function is basically waiting for promise to be fullfilled
    const getCountryData = async() => { // fetch is built in JS func for get reqs
      await fetch(get_url_countries_data) // await waits for the promise to be fullfilled
        .then((res) => res.json())
        .then((data) => { //Taking the JSON and then getting the specific info we want 
          const countries = data.map(country => (
            {
              name: country.country, // United States, India, etc
              value: country.countryInfo.iso2 // UK, IN, GER
            }
          )); 
          setCountries(countries); //Setting state to this country
        })
    } 
    getCountryData(); 
  }, []) //This function is only called once at the init of the component

  // When I click on the dropdown, make call 
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

	const url = countryCode === "worldwide" ? get_url_all_countries_data : 
		get_url_countries_data
	
	await fetch(url)
		.then(res => res.json())
		.then(data => )
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
			<InfoBox title="Coronavirus Cases" cases={123} total={2000}/>
			
			{/* Infobox for Covid Cases*/}
			<InfoBox title="Recovered" cases={456} total={3000}/>
			
			{/* Infobox for Covid Cases*/}
			<InfoBox title="Deaths" cases={789} total={4000}/>
		</div>

		{/* Map */}
		<Map />
	  </div>
      
      <Card className="app_right">
			<CardContent>
				<h3>Live Cases by Country</h3>
				{/* Table */}
				<h3>Worldwide New Cases</h3>
				{/* Graph */} 
			</CardContent>	  		
	  </Card>


      

    </div>
  );
}

export default App;
