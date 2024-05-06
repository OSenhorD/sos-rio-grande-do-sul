import {
  AfterViewInit,
  Component,
  inject,
} from "@angular/core"

import { MarkerService } from "src/app/services/marker.service"

@Component({
  selector: "app-map",
  standalone: true,
  templateUrl: "./map.component.html",
  styleUrl: "./map.component.scss"
})

export class MapComponent implements AfterViewInit {
  private readonly _markerService = inject(MarkerService)

  ngAfterViewInit(): void {
    this._markerService.initMap()
  }
}
