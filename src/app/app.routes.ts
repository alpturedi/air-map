import { Routes } from "@angular/router";
import { MapComponent } from "./pages/map/map.component";
import { AboutComponent } from "./pages/about/about.component";
import { AirportsComponent } from "./pages/airports/airports.component";

export const routes: Routes = [
  { path: "", component: MapComponent },
  { path: "airports", component: AirportsComponent },
  { path: "about", component: AboutComponent },
];
