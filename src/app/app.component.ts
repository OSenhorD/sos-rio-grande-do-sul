import {
  Component,
  inject,
  OnInit,
} from "@angular/core"

import { FormBuilder, FormControl } from "@angular/forms"

import { DataService, IAbrigo, IColeta } from "src/app/services/data.service"
import { MarkerService } from "src/app/services/marker.service"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})

export class AppComponent implements OnInit {
  private readonly _formBuilder: FormBuilder = inject(FormBuilder)
  private readonly _dataService = inject(DataService)
  private readonly _markerService = inject(MarkerService)

  typeLocation: "mantimento" | "abrigo" = "mantimento"
  typeForm: "mantimento" | "abrigo" = "mantimento"

  abrigos: IAbrigo[] = []
  coletas: IColeta[] = []

  protected readonly form = this._formBuilder.group(
    {
      name: new FormControl(""),
      telephone: new FormControl(""),
      local: new FormControl(""),
      pix: new FormControl(""),
      ocupado: new FormControl(""),
      livre: new FormControl(""),
      message: new FormControl(""),
    },
  )

  ngOnInit(): void {
    this._dataService.inserirLocais()
    this._dataService.abrigos.subscribe(items => this.abrigos = items)
    this._dataService.coletas.subscribe(items => this.coletas = items)
  }

  get items(): IAbrigo[] | IColeta[] {
    return this.typeLocation == "abrigo" ? this.abrigos : this.coletas
  }

  showInMap = (item: IAbrigo | IColeta) => {
    this._markerService.moveMap(item.coordenadas[0], item.coordenadas[1])
  }

  onSubmit = async () => {
    const url = "https://script.google.com/macros/s/AKfycbx0tQcled-WorNHa01YC-95DpfpxVnp2KxoweqPe3HVJjc08gBq9lZ50gGAKGasjd_O/exec"

    const formData = new FormData()
    formData.append("name", `${this.form.value.name || ""}`)
    formData.append("telephone", `${this.form.value.telephone || ""}`)
    formData.append("local", `${this.form.value.local || ""}`)
    formData.append("pix", `${this.form.value.pix || ""}`)
    formData.append("ocupado", `${this.form.value.ocupado || 0}`)
    formData.append("livre", `${this.form.value.livre || 0}`)
    formData.append("message", `${this.form.value.message || ""}`)

    try {
      await fetch(url, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      })

      this._showMessage("form-success")
      this.form.reset({}, { emitEvent: false })
    } catch (error) {
      console.log("onSubmit error", error)
      this._showMessage("form-error")
    }
  }

  private _showMessage = (id: string) => {
    const formSuccess = document?.getElementById(id)
    if (formSuccess?.style) {
      formSuccess.style.display = "block"
      setTimeout(() => formSuccess.style.display = "none", 5 * 1000);
    }
  }
}
