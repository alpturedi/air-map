import { Component, OnInit } from "@angular/core";
import { AccordionModule } from "primeng/accordion";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-airports",
  imports: [AccordionModule],
  templateUrl: "./airports.component.html",
  styleUrl: "./airports.component.css",
})
export class AirportsComponent implements OnInit {
  airports: any[] = [];
  ngOnInit() {
    const airports = JSON.parse(sessionStorage.getItem("airports") ?? "[]");
    if (!Array.isArray(airports) || airports?.length <= 0) {
      getAirports().then((airports) => {
        this.airports = airports;
      });
    } else {
      this.airports = airports;
    }
  }
  airportDescription = "";
}

async function getAirports() {
  const url = `https://airlabs.co/api/v9/airports?country_code=NO&api_key=${environment.API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    const airports = json.response.filter((item: any) => item?.["iata_code"] != null);

    sessionStorage.setItem("airports", JSON.stringify(airports));

    return airports;
  } catch (error: any) {
    console.error(error?.message);
  }
}
