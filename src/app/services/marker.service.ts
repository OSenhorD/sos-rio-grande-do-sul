import { HttpClient } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import * as L from "leaflet"

interface IAbrigo {
  name: string
  local: string
  telefone: string[]
  ocupado: number
  livre: number
  coordenadas: number[]
}

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
        items = (items as IColeta[]).filter(item => item.coordenadas.length > 0)
        for (const item of items) {
          item.telefone = Array.isArray(item.telefone) ? item.telefone : []

          L
            .marker([item.coordenadas[0], item.coordenadas[1]])
            .addTo(map)
            .bindPopup(this.inserirPopupAbrigo(item))
        }
      })

    this._http.get(this._coletas)
      .subscribe((items: any) => {
        items = (items as IColeta[]).filter(item => item.coordenadas.length > 0)
        for (const item of items) {
          item.pix = Array.isArray(item.pix) ? item.pix : []
          item.itens = Array.isArray(item.itens) ? item.itens : []
          item.telefone = Array.isArray(item.telefone) ? item.telefone : []

          L
            .marker([item.coordenadas[0], item.coordenadas[1]])
            .addTo(map)
            .bindPopup(this.inserirPopupColeta(item))
        }
      })
  }

  inserirPopupAbrigo(data: IAbrigo): string {
    return `` +
      `<div>Nome: <strong>${data.name}</strong></div>` +
      `<div>Local: <strong>${data.local}</strong></div>` +
      `<div>Telefone: <strong>${data.telefone.join(", ")}</strong></div>` +
      `<div>Ocupantes: <strong>${data.ocupado || 0}</strong></div>` +
      `<div>Vagas: <strong>${data.livre || 0}</strong></div>` +
      `<br />` +
      `<div><strong>Ligue para confirmar disponibilidade</strong></div>`
  }

  inserirPopupColeta(data: IColeta): string {
    return `` +
      `<div>Nome: <strong>${data.name}</strong></div>` +
      `<div>Local: <strong>${data.local}</strong></div>` +
      `<div>Telefone: <strong>${data.telefone.join(", ")}</strong></div>` +
      `<div>Pix: <strong>${data.pix.join(", ")}</strong></div>`
  }
}
