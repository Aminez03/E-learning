import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormationService } from 'src/Services/formation.service';
import { AuthService } from '../authentification/auth.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';


@Component({
  selector: 'app-modal-session',
  templateUrl: './modal-session.component.html',
  styleUrls: ['./modal-session.component.css']
})
export class ModalSessionComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nomFormation', 'dateDebut','nombreInscrits', 'dateFin', 'capacite', 'formateur', 'actions'];

  form!: FormGroup;
  formations: any[] = [];
  formateurs: any[] = [];
  errorMessage: string = '';
  token: string = ''; // Récupérer le token depuis le localStorage

  constructor(
    public dialogRef: MatDialogRef<ModalSessionComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private FS: FormationService,
    private authService: AuthService
  ) {
    console.log(data);
if(data){
  this.form = new FormGroup({
    dateDebut: new FormControl(data.dateDebut , [Validators.required]),
    dateFin: new FormControl(data.dateFin , [Validators.required]),
    statut: new FormControl(data.statut , [Validators.required]),
    capacite: new FormControl(data.capacite , [Validators.required, Validators.min(1)]),
    nombreInscrits: new FormControl(data.nombreInscrits, [Validators.required, Validators.min(0)]),
    formationID: new FormControl(data.formationID , [Validators.required]),
    formateurID: new FormControl(data.formateurID , [Validators.required])
  });
  
}
else{
    this.form = new FormGroup({
      dateDebut: new FormControl( null, [Validators.required]),
      dateFin: new FormControl( null, [Validators.required]),
      statut: new FormControl( null, [Validators.required]),
      capacite: new FormControl( null, [Validators.required, Validators.min(1)]),
      nombreInscrits: new FormControl( null, [Validators.required, Validators.min(0)]),
      formationID: new FormControl( null, [Validators.required]),
      formateurID: new FormControl( null, [Validators.required])
    });
  }
  }
  ngOnInit(): void {
    this.token = localStorage.getItem('CC_Token') || ''; // Récupération du token
    this.fetchData();
    this.fetchUsersByRole('formateur');
    console.log('Formateurs:', this.formateurs);
  }

  fetchData(): void {
    this.FS.getAllFormations().subscribe(
      (data) => this.formations = data,
      (error) => console.error('Erreur de récupération des formations:', error)
    );
  }

  fetchUsersByRole(role: string): void {
    this.authService.getUsersByRole(role, this.token).subscribe(
      (response) => {
        if (response.success) {
          this.formateurs = response.users;
        } else {
          this.errorMessage = response.message;
        }
      },
      (error) => {
        this.errorMessage = error.error?.message || 'Une erreur est survenue.';
        console.error('Erreur:', error);
      }
    );
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.errorMessage = "Veuillez remplir tous les champs obligatoires.";
    }
  }

  close() {
    this.dialogRef.close();
  }

  onDateChange(event: any, type: string) {
    if (event.value) {
      const formattedDate = moment(event.value).format('YYYY-MM-DD');
      if (type === 'start') {
        this.form.get('dateDebut')?.setValue(formattedDate);
      } else {
        this.form.get('dateFin')?.setValue(formattedDate);
      }
    }
  }

}


