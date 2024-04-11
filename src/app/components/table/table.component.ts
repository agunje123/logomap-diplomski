import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Kabinet } from '../../model/kabinet';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  dataSource = new MatTableDataSource<Kabinet>([]);
  displayedColumns: string[] = [
    'id',
    'name',
    'address',
    'website',
    'phoneNumber',
    'actions',
  ];
  data: Kabinet[] = [];

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.parseCsv(file);
    }
  }

  parseCsv(file: File) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const csv = reader.result as string;
      const rows = csv.split('\n');
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const columns = this.parseCsvRow(row);
        const kabinet: Kabinet = {
          id: parseInt(columns[0]) + 1,
          name: columns[1],
          address: columns[2],
          website: columns[3],
          phoneNumber: columns[4],
          longitude: parseFloat(columns[5]),
          latitude: parseFloat(columns[6]),
        };
        if (kabinet.id) {
          this.data.push(kabinet);
        }
      }
      this.dataSource.data = this.data;
      console.log(this.dataSource.data);
    };
    reader.onerror = () => {
      console.error('Error reading CSV file');
    };
  }

  parseCsvRow(row: string): string[] {
    const columns = [];
    let currentColumn = '';
    let withinQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === ',' && !withinQuotes) {
        columns.push(currentColumn.trim());
        currentColumn = '';
      } else if (char === '"' && (i === 0 || row[i - 1] !== '\\')) {
        withinQuotes = !withinQuotes;
      } else {
        currentColumn += char;
      }
    }
    columns.push(currentColumn.trim());
    return columns;
  }
}
