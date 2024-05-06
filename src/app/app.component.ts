import { Component, inject } from "@angular/core"
import { FormBuilder, FormControl } from "@angular/forms"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})

export class AppComponent {
  private readonly _formBuilder: FormBuilder = inject(FormBuilder)

  type: "mantimento" | "abrigo" = "mantimento"

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
