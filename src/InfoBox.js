import React from "react"; 
import "./InfoBox.css";

import {Card, CardContent, Typography} from "@material-ui/core";
import {prettyPrintStat} from "./util";

function InfoBox({active, isRed, onClick, title, cases, total}) {
    return (
        <Card onClick={onClick} className={`infoBox ${active && "infoBox-selected"} ${isRed && "infoBox-red"}`}>
            <CardContent>
                {/* Title */}
                <Typography className="infoBox_title" color="textSecondary">
                    {title}
                </Typography>

                {/* # of cases */}
                <h2 className={`infoBox_cases ${!isRed && "infoBox_cases-green"}`}>+{prettyPrintStat(cases )}</h2>

                {/* # of total */}
                <Typography className="infoBox_total" color="textSecondary">
                    {prettyPrintStat(total)} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox; 