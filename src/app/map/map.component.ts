import { Component, OnInit, ViewChild } from "@angular/core";
import { GoogleMap, MapAdvancedMarker, MapInfoWindow } from "@angular/google-maps";
import { environment } from "../../environments/environment";

type MarkerOptions = google.maps.marker.AdvancedMarkerElementOptions;
type Marker = { options: MarkerOptions; iata: string };

@Component({
  selector: "app-map",
  imports: [GoogleMap, MapAdvancedMarker, MapInfoWindow],
  templateUrl: "./map.component.html",
  styleUrl: "./map.component.css",
})
export class MapComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  mapOptions: google.maps.MapOptions = {
    zoom: 4.5,
    center: { lat: 65, lng: 11 },
    // disableDefaultUI: true,
    // clickableIcons: false,
    mapId: "a1c0f2b3d4e5f6",
  };

  markers: Marker[] = [
    {
      options: {
        position: { lat: 60.39299, lng: 5.32415 },
        title: "Bergen",
        gmpClickable: true,
      },
      iata: "BGO",
    },
  ];

  async getFlights(marker: Marker) {
    const url = `https://airlabs.co/api/v9/schedules?dep_iata=${marker.iata}&api_key=${environment.API_KEY}&limit=5`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();

      var nextFlights = "";
      (json?.response ?? []).slice(0, 5).forEach((flight: any) => {
        nextFlights += `Flight: ${flight.flight_iata} - Departure: ${flight.dep_time} - Arrival: ${flight.arr_iata}<br>`;
      });
      this.infoWindowContent = nextFlights;
      console.log("¡ ⛰️ getFlights ⛰️ !", json?.response, nextFlights);
    } catch (error: any) {
      console.error(error?.message);
    }
  }

  infoWindowContent = "";
  openInfoWindow(markerRef: MapAdvancedMarker, marker: Marker) {
    console.log("openInfoWindow", markerRef);
    this.infoWindowContent = marker.options.title ?? "";
    this.infoWindow.open(markerRef);
    this.getFlights(marker);
  }

  ngOnInit() {
    (async () => {
      const airports = localStorage.getItem("airports");
      if ((airports?.length ?? 0) > 0) {
        this.markers = JSON.parse(airports ?? "");
        return;
      }

      const url = `https://airlabs.co/api/v9/airports?country_code=NO&api_key=${environment.API_KEY}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();

        const parsedAirports = json.response
          .filter((item: any) => item?.["iata_code"] != null)
          .map((item: any) => ({
            options: {
              position: { lat: item.lat, lng: item.lng },
              title: item.name,
              gmpClickable: true,
            },
            iata: item.iata_code,
          }));

        localStorage.setItem("airports", JSON.stringify(parsedAirports));

        this.markers = parsedAirports;
      } catch (error: any) {
        console.error(error?.message);
      }
    })();
  }
}
