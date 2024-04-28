import { Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../services/map.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SupabaseService } from '../../services/supabase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, OnDestroy {
  private map!: L.Map;
  private centroid: L.LatLngExpression = [45.81, 15.98];
  private markerIcon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      iconUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png',
    }),
  };
  chosenLocation: any = [];
  latitude: number = 0;
  longitude: number = 0;

  subs: Subscription = new Subscription();

  constructor(
    private supabaseService: SupabaseService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.subs.add(
      this.supabaseService.kabinetListSub.subscribe({
        next: (kabineti) => {
          kabineti.forEach((kabinet) => {
            this.createMarkerWithPopup(kabinet.latitude!, kabinet.longitude!);
          });
        },
      })
    );
    this.supabaseService.getKabinetList();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initMap() {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 13,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 12,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
  }

  createMarkerWithPopup(latitude: number, longitude: number) {
    let marker = L.marker([latitude, longitude], this.markerIcon);
    let popup = this.createPopup(latitude, longitude);
    marker.addTo(this.map);
    marker.bindPopup(popup);
    this.chosenLocation.push(marker);
  }

  createPopup(latitude: number, longitude: number) {
    let latitudeShort = latitude.toFixed(4);
    let longitudeShort = longitude.toFixed(4);
    return (
      `Chosen location: ` +
      `<div>Latitude: ${latitudeShort}</div>` +
      `<div>Longitude: ${longitudeShort}</div>`
    );
  }

  setCoordinates() {
    if (this.latitude != 0 && this.longitude != 0) {
      this.mapService.isMapOpenSub.next(false);
      this.mapService.setCoordinates(this.latitude, this.longitude);
    } else {
      console.log('Please select a location.');
    }
  }
}
