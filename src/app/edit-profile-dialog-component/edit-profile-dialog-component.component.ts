import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-profile-dialog-component',
  templateUrl: './edit-profile-dialog-component.component.html',
  styleUrls: ['./edit-profile-dialog-component.component.css']
})
export class EditProfileDialogComponentComponent {

  user: any;

  constructor(
    public dialogRef: MatDialogRef<EditProfileDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = { ...data }; // Clone user data to avoid modifying it directly
  }

  save() {
    this.dialogRef.close(this.user); // Send updated data back
  }

  close() {
    this.dialogRef.close(); // Close without saving
  }
}