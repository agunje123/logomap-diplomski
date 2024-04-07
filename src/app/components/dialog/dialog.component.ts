import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Kabinet } from '../../model/kabinet';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit {
  kabinetForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Kabinet,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.kabinetForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      email: ['', Validators.email],
      website: [''],
      phoneNumber: [''],
    });
  }

  onSubmit() {
    if (this.kabinetForm.valid) {
      console.log(this.kabinetForm.value);
    } else {
      this.snackBar.open('Ispunite sva potrebna polja.');
    }
  }
}
