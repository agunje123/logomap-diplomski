import { Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../services/map.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SupabaseService } from '../../services/supabase.service';
import { Subscription } from 'rxjs';
import { Kabinet } from '../../model/kabinet';

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

  subs: Subscription = new Subscription();

  constructor(
    private supabaseService: SupabaseService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.supabaseService.kabinetListSub.subscribe({
        next: (kabineti) => {
          kabineti.forEach((kabinet) => {
            this.createMarkerWithPopup(kabinet);
          });
        },
      })
    );
    this.initMap();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initMap() {
    this.mapService.kabinetSub.subscribe({
      next: (kabinet) => {
        this.panToKabinet(kabinet);
      },
    });

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

    this.supabaseService.getKabinetList();
  }

  createMarkerWithPopup(kabinet: Kabinet) {
    let marker = L.marker(
      [kabinet.latitude!, kabinet.longitude!],
      this.markerIcon
    );
    let popup = this.createPopup(kabinet);
    marker.addTo(this.map);
    marker.bindPopup(popup);
  }

  createPopup(kabinet: Kabinet) {
    let popupContent =
      `<div>Ime Kabineta: ${kabinet.name}</div>` +
      `<div>Adresa: ${kabinet.address}</div>`;

    if (kabinet.website) {
      popupContent += `<div>Web-stranica: ${kabinet.website}</div>`;
    }

    if (kabinet.phone_number) {
      popupContent += `<div>Kontakt broj: ${kabinet.phone_number}</div>`;
    }

    return popupContent;
  }

  panToKabinet(kabinet: Kabinet) {
    this.map.panTo(new L.LatLng(kabinet.latitude!, kabinet.longitude!));
  }
}
