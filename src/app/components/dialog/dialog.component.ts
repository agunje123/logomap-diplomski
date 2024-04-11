import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { Kabinet } from '../../model/kabinet';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDialogContent,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit {
  kabinetForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Kabinet,
    private dialogRef: MatDialogRef<DialogComponent>,
    private fb: FormBuilder,
    private supabase: SupabaseService
  ) {}

  ngOnInit(): void {
    this.kabinetForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      email: ['', Validators.email],
      website: [''],
      phoneNumber: [''],
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close();
  }
}
