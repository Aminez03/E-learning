import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cour } from 'src/Models/Cour';

@Component({
  selector: 'app-modal-cour',
  templateUrl: './modal-cour.component.html',
  styleUrls: ['./modal-cour.component.css']
})
export class ModalCourComponent {
  form!: FormGroup;
  displayedColumns: string[] = ['id', 'titre', 'description', 'formationSessionId', 'action'];
  constructor(
    public dialogRef: MatDialogRef<ModalCourComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cour // Injecter les données du cours
  ) {
    console.log(data);
    if(data){
    // Initialiser le formulaire avec les données du cours (si elles existent)
    this.form = new FormGroup({
      idFormationSession: new FormControl(data.formationSessionID || null, [Validators.required]),
      titre: new FormControl(data.titre || null, [Validators.required]),
      description: new FormControl(data.description || null, [Validators.required]),
      videoUrl: new FormControl(data.videoUrl || null, [Validators.required]),
    });
  }else{
    // Initialiser le formulaire avec des valeurs par défaut (si les données du cours n'existent pas)
    this.form = new FormGroup({   
      idFormationSession: new FormControl(null, [Validators.required]),
      titre: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      videoUrl: new FormControl(null, [Validators.required]),
    });
  }
  }

  // Méthode pour enregistrer les données du formulaire
  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  // Méthode pour fermer le modal sans enregistrer
  close() {
    this.dialogRef.close();
  }
}