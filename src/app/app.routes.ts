import { Routes } from "@angular/router";
import { MapComponent } from "./pages/map/map.component";
import { AboutComponent } from "./pages/about/about.component";

export const routes: Routes = [
  { path: "", component: MapComponent },
  { path: "about", component: AboutComponent },
];
