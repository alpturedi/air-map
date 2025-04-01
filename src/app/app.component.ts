import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { GoogleMapsModule } from "@angular/google-maps";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, GoogleMapsModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "air-map";
  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: { lat: -31, lng: 147 },
    zoom: 4,
  };
}
