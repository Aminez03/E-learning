import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Formation } from 'src/Models/Formation';
import { FormationService } from 'src/Services/formation.service';
import { ModalFormationComponent } from '../modal-formation/modal-formation.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
import { SharedService } from 'src/Services/shared.service';
import { SousCategorieService } from 'src/Services/sous-categorie.service';


@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css']
})
export class FormationComponent {

  displayedColumns: string[] = ['id', 'nomFormation', 'niveau', 'duree', 'action','image'];
  dataSource: Formation[]=[] ;
  allFormations: Formation[] = [];

  constructor(private FS: FormationService, private dialog: MatDialog,private sharedService: SharedService,private SCS:SousCategorieService) {}

  ngOnInit(): void {
    // Charger toutes les formations au départ
    this.fetchData();

    // Écouter les changements de sous-catégorie sélectionnée
    this.sharedService.selectedSousCategorieId$.subscribe(sousCategorieID => {
      if (sousCategorieID) {
        // Appliquer le filtre
        this.filterFormations(sousCategorieID);
        console.log('Sous-catégorie sélectionnée :', sousCategorieID);
      } else {
        // Si aucune sous-catégorie n'est sélectionnée, afficher toutes les formations
        this.dataSource = this.allFormations;
      }
    });
  }

  fetchData(): void {
    // Récupérer toutes les formations au départ
    this.FS.getAllFormations().subscribe(data => {
      this.allFormations = data;
      this.dataSource = data;  // Initialiser avec toutes les formations
    });
  }

  // Filtrer les formations en fonction de la sous-catégorie
  filterFormations(sousCategorieID: number) {
this.SCS.getFormations(sousCategorieID).subscribe(data => {
    this.dataSource = data;
  });}
  

  open(): void {
    let dialogRef = this.dialog.open(ModalFormationComponent, {
      height: '500px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.FS.addFormation(data).subscribe(() => {
          console.log("Formation ajoutée avec succès");
          this.fetchData();
        });
      }
    });
  }

  openEdit(id: number): void {
    this.FS.getFormationById(id).subscribe((formation) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = formation;

      let dialogRef = this.dialog.open(ModalFormationComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.FS.updateFormation(id, data).subscribe(() => {
            console.log("Formation modifiée avec succès");
            this.fetchData();
          });
        }
      });
    });
  }

  deleteFormation(id: number): void {
    let dialogRef = this.dialog.open(ConfirmdialogComponent, {
      height: '200px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.FS.deleteFormation(id).subscribe(() => {
          console.log("Formation supprimée");
          this.fetchData();
        });
      }
    });
  }
}