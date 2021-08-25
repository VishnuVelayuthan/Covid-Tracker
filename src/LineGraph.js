import React, {useEffect, useState} from "react"; 
import {Line, defaults} from "react-chartjs-2";
import numeral from "numeral";

const line_data_url = "https://disease.sh/v3/covid-19/historical/all?lastdays=120"

defaults.backgroundColor = "rgba(204, 16, 52, 0.5)";
defaults.plugins.legend.display = false; 

const options = {
    elements: {
        point: {
            radius: 0
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0")
            }
        }
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll"
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false
                },
                ticks: {
                    callback: function(value, index, values) {
                        return numeral(value).format("0a")
                    }
                }
            }
        ], 
    },
}

// This takes in our data object and what type of cases we want to graph
const buildChartData = (data, casesType="cases") => {
    const chartData = []; 
    let lastDataPoint; 

    // gets the "type" of cases list from the JSON
    for (let date in data[casesType]) { 
        if (lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint
            }
            chartData.push(newDataPoint); 
        }
        lastDataPoint = data[casesType][date];
    };
    return chartData; 
}

function LineGraph({casesType="cases", ...props}) {
    const [data, setData] = useState({});

    // useEffect to get data on the prev Covid cases
    useEffect(() => {
        const getChartData = async () => {
            await fetch(line_data_url)
            .then(res => res.json())
            .then(data => {
                const chartData = buildChartData(data, casesType);

                if (chartData.length === 101){
                    chartData[100] = chartData[99];
                }
                setData(chartData); 
                
            });
        }
        
        getChartData(); 
    }, [casesType]);
    // console.log("hellO");
    // console.log(data);
    console.log(data); 
    return (
        <div className={props.classes}>
            {/* If data exists do this */}
            {data?.length > 0 && (
                <Line 
                    data={{
                        datasets: [{
                            backgroundColor: "rgba(204, 16, 52, 0.5)",
                            borderColor: "#CC1034",
                            fill: true, 
                            data: data
                        }]
                    }} 
                    options={options}
                />
            )}
        </div>
            
            
    );
}

export default LineGraph;