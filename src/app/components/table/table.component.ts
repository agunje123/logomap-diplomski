import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

export interface Kabinet {
  id: number;
  name: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource: Kabinet[] = [
    { id: 1, name: 'Svasta' },
    { id: 2, name: 'Nesta' },
  ];
}
