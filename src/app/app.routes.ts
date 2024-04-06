import { Routes } from '@angular/router';
import { TableComponent } from './components/table/table.component';
import { MapComponent } from './components/map/map.component';

export const routes: Routes = [
  { path: 'map', component: MapComponent },
  { path: 'table', component: TableComponent },
];
