import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"

import { Observable, Subject } from "rxjs"

export interface IAbrigo {
  name: string
  local: string
  telefone: string[]
  ocupado: number
  livre: number
  coordenadas: number[]
}

export interface IColeta {
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

export class DataService {
  private readonly _http = inject(HttpClient)

  private readonly _abrigoSubject = new Subject<IAbrigo[]>()
  private readonly _coletaSubject = new Subject<IColeta[]>()

  private readonly _abrigosUrl: string = "/assets/abrigos.json"
  private readonly _coletasUrl: string = "/assets/coletas.json"

  get abrigos(): Observable<IAbrigo[]> {
    return this._abrigoSubject.asObservable()
  }

  get coletas(): Observable<IColeta[]> {
    return this._coletaSubject.asObservable()
  }

  inserirLocais = (): void => {
    this._http.get(this._abrigosUrl)
      .subscribe((items: any) => {
        items = (items as IColeta[])
          .filter(item => item.coordenadas.length > 0)
          .map(item => {
            item.telefone = Array.isArray(item.telefone) ? item.telefone : []
            return item
          })

        this._abrigoSubject.next(items)
      })

    this._http.get(this._coletasUrl)
      .subscribe((items: any) => {
        items = (items as IColeta[])
          .filter(item => item.coordenadas.length > 0)
          .map(item => {
            item.pix = Array.isArray(item.pix) ? item.pix : []
            item.itens = Array.isArray(item.itens) ? item.itens : []
            item.telefone = Array.isArray(item.telefone) ? item.telefone : []
            return item
          })

        this._coletaSubject.next(items)
      })
  }
}
