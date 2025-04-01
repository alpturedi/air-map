import { Component } from "@angular/core";
import { TranslateService, TranslatePipe, TranslateDirective } from "@ngx-translate/core";

@Component({
  selector: "app-about",
  imports: [TranslatePipe],
  templateUrl: "./about.component.html",
  styleUrl: "./about.component.css",
})
export class AboutComponent {}
