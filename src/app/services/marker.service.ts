import {
  Injectable,
  inject,
  OnDestroy,
} from "@angular/core"

import { Subscription } from "rxjs"

import * as L from "leaflet"

import {
  DataService,
  IAbrigo,
  IColeta,
} from "src/app/services/data.service"

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

@Injectable({
  providedIn: "root",
})

export class MarkerService implements OnDestroy {
  private readonly _dataService = inject(DataService)

  private readonly _subscription = new Subscription()

  private _map!: L.Map

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }

  initMap = (): void => {
    this._map = L.map("map", {
      center: [-30.036489395368644, -51.21722834544419],
      zoom: 14,
      maxZoom: 19,
      minZoom: 9,
      fadeAnimation: true,
    })

    const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      minZoom: 3,
      attribution: "&copy <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
    })

    tiles.addTo(this._map)

    this._inserirLocais()
  }

  moveMap = (lat: number, long: number) => {
    this._map.setView([lat, long])
  }

  private _inserirLocais = (): void => {
    const abrigos = this._dataService.abrigos
      .subscribe((items: IAbrigo[]) => {
        const icon = L.icon({ iconUrl: "assets/abrigo.png", iconSize: [40, 40] })

        for (const item of items) {
          L
            .marker([item.coordenadas[0], item.coordenadas[1]], { icon })
            .addTo(this._map)
            .bindPopup(this._inserirPopupAbrigo(item))
        }
      })

    const coletas = this._dataService.coletas
      .subscribe((items: IColeta[]) => {
        const icon = L.icon({ iconUrl: "assets/coleta.png", iconSize: [40, 40] })

        for (const item of items) {
          L
            .marker([item.coordenadas[0], item.coordenadas[1]], { icon })
            .addTo(this._map)
            .bindPopup(this._inserirPopupColeta(item))
        }
      })

    this._subscription.add(abrigos)
    this._subscription.add(coletas)
  }

  private _inserirPopupAbrigo(data: IAbrigo): string {
    return `` +
      `<div>Nome: <strong>${data.name}</strong></div>` +
      `<div>Local: <strong>${data.local}</strong></div>` +
      `<div>Telefone: <strong>${data.telefone.join(", ")}</strong></div>` +
      `<div>Ocupantes: <strong>${data.ocupado || 0}</strong></div>` +
      `<div>Vagas: <strong>${data.livre || 0}</strong></div>` +
      `<br />` +
      `<div><strong>Ligue para confirmar disponibilidade</strong></div>`
  }

  private _inserirPopupColeta(data: IColeta): string {
    return `` +
      `<div>Nome: <strong>${data.name}</strong></div>` +
      `<div>Local: <strong>${data.local}</strong></div>` +
      `<div>Telefone: <strong>${data.telefone.join(", ")}</strong></div>` +
      `<div>Pix: <strong>${data.pix.join(", ")}</strong></div>`
  }
}
