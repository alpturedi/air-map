import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TranslateService, TranslatePipe } from "@ngx-translate/core";

import translationsEN from "../../public/i18n/en.json";
import translationsTR from "../../public/i18n/tr.json";
@Component({
  selector: "app-root",
  imports: [RouterOutlet, TranslatePipe],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "air-map";
  selectedLanguage = "en";

  constructor(private translate: TranslateService) {
    const storedLocale = sessionStorage.getItem("locale");
    translate.setTranslation("en", translationsEN);
    translate.setTranslation("tr", translationsTR);
    if (storedLocale === "tr") {
      this.selectedLanguage = "tr";
      translate.setDefaultLang(storedLocale);
    } else {
      this.selectedLanguage = "en";
      translate.setDefaultLang("en");
    }
  }

  changeLanguage($event: Event) {
    const newLanguage = ($event?.target as HTMLSelectElement)?.value === "tr" ? "tr" : "en";
    this.translate.use(newLanguage);
    this.selectedLanguage = newLanguage;
    sessionStorage.setItem("locale", newLanguage);
  }
}
