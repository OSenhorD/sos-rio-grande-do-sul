import { HttpClient } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import * as L from "leaflet"

interface IColeta {
  name: string
  local: string
  telefone: string[]
  pix: string[]
  itens: string[]
  coordenadas: number[]
}

@Injectable({
  providedIn: "root",
})

export class MarkerService {
  private _http = inject(HttpClient)
  private _abrigos: string = "/assets/abrigos.json"
  private _coletas: string = "/assets/coletas.json"

  inserirLocais(map: L.Map): void {
    this._http.get(this._abrigos)
      .subscribe((items: any) => {
      })

    this._http.get(this._coletas)
      .subscribe((items: any) => {
        items = (items as IColeta[]).filter(item => item.coordenadas.length > 0)
        for (const item of items) {
          L
            .marker([item.coordenadas[0], item.coordenadas[1]])
            .addTo(map)
            .bindPopup(this.inserirPopupColeta(item))
        }
      })
  }

  inserirPopupColeta(data: IColeta): string {
    return `` +
      `<div>Nome: <strong>${data.name}</strong></div>` +
      `<div>Local: <strong>${data.local}</strong></div>` +
      `<div>Telefone: <strong>${data.telefone.join(", ")}</strong></div>` +
      `<div>Pix: <strong>${data.pix.join(", ")}</strong></div>`
  }
}
