import { Component, OnInit, ViewChild } from "@angular/core";
import { GoogleMap, MapAdvancedMarker, MapInfoWindow } from "@angular/google-maps";
import { environment } from "../../../environments/environment";

type MarkerOptions = google.maps.marker.AdvancedMarkerElementOptions;
type Marker = { options: MarkerOptions; iata: string };
import { TranslateService, _ } from "@ngx-translate/core";
@Component({
  selector: "app-map",
  imports: [GoogleMap, MapAdvancedMarker, MapInfoWindow],
  templateUrl: "./map.component.html",
  styleUrl: "./map.component.css",
})
export class MapComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  constructor(private translate: TranslateService) {
    this.translate;
  }

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

      let nextFlights = `<span class="font-bold text-lg">${marker?.options?.title ?? ""}</span><br/>`;
      (json?.response ?? []).slice(0, 5).forEach((flight: any) => {
        nextFlights += this.translate.instant("map.nextFlights", {
          flight: flight.flight_iata,
          time: flight.dep_time.slice(flight.dep_time.lastIndexOf(" ")),
          destination: flight.arr_iata,
        });
      });
      this.infoWindowContent = nextFlights;
    } catch (error: any) {
      console.error("Error getting flights :", error?.message);
    }
  }

  infoWindowContent = "";
  openInfoWindow(markerRef: MapAdvancedMarker, marker: Marker) {
    this.infoWindowContent = marker.options.title ?? "";
    this.infoWindow.open(markerRef);
    this.getFlights(marker);
  }

  ngOnInit() {
    (async () => {
      const airports = sessionStorage.getItem("airports");
      if ((airports?.length ?? 0) > 0) {
        this.markers = parseAirports(JSON.parse(airports ?? "[]"));
        return;
      }

      const url = `https://airlabs.co/api/v9/airports?country_code=NO&api_key=${environment.API_KEY}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();

        sessionStorage.setItem(
          "airports",
          JSON.stringify(json.response.filter((item: any) => item?.["iata_code"] != null))
        );

        this.markers = parseAirports(json.response);
      } catch (error: any) {
        console.error(error?.message);
      }
    })();
  }
}

function parseAirports(rawList: any[]) {
  return rawList.map((item: any) => ({
    options: {
      position: { lat: item.lat, lng: item.lng },
      title: item.name,
      gmpClickable: true,
    },
    iata: item.iata_code,
  }));
}
