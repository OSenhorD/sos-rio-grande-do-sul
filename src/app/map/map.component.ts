import { AfterViewInit, Component, inject } from "@angular/core"
import * as L from "leaflet"

import { MarkerService } from "src/app/services/marker.service"

const iconRetinaUrl = "assets/marker-icon-2x.png"
const iconUrl = "assets/marker-icon.png"
const shadowUrl = "assets/marker-shadow.png"
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})
L.Marker.prototype.options.icon = iconDefault

@Component({
  selector: "app-map",
  standalone: true,
  templateUrl: "./map.component.html",
  styleUrl: "./map.component.scss"
})

export class MapComponent implements AfterViewInit {
  private _markerService = inject(MarkerService)

  private _map!: L.Map

  ngAfterViewInit(): void {
    this.initMap()
    this._markerService.inserirLocais(this._map)
  }

  private initMap(): void {
    this._map = L.map("map", {
      center: [-30.036489395368644, -51.21722834544419],
      zoom: 12,
      fadeAnimation: true,
    })

    const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      minZoom: 3,
      attribution: "&copy <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
    })

    tiles.addTo(this._map)
  }
}
