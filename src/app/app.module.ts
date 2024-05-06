import { LOCALE_ID, NgModule } from "@angular/core"
import { HttpClientModule } from "@angular/common/http"
import { BrowserModule } from "@angular/platform-browser"
import { registerLocaleData } from "@angular/common"
import { RouterModule, Routes } from "@angular/router"
import localeBr from "@angular/common/locales/pt"
import { ReactiveFormsModule } from "@angular/forms"
import { AppComponent } from "src/app/app.component"
import { MapComponent } from "src/app/map/map.component"

registerLocaleData(localeBr, "pt")

const routes: Routes = [
  {
    path: "", pathMatch: "full",
    loadComponent: () => import("src/app/app.component").then((c) => c.AppComponent),
  },
  { path: "**", redirectTo: "" },
]

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      bindToComponentInputs: true,
      enableViewTransitions: true,
    }),
    MapComponent,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pt" },
  ],
  bootstrap: [
    AppComponent,
  ],
})

export class AppModule { }
