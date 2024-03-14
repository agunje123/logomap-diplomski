import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
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
  private chosenLocation: any = [];
  latitude: number = 0;
  longitude: number = 0;

  constructor(private mapService: MapService) {}

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 14,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 14,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);

    this.map.on('click', (e) => {
      this.removePreviousMarkers();
      this.createMarkerWithPopup(e.latlng.lat, e.latlng.lng);
      this.latitude = e.latlng.lat;
      this.longitude = e.latlng.lng;
    });
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

  removePreviousMarkers() {
    for (let marker of this.chosenLocation) {
      this.map.removeLayer(marker);
    }
    this.chosenLocation = [];
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
