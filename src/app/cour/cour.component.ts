import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Cour } from 'src/Models/Cour';
import { CourService } from 'src/Services/cour.service';
import { ModalCourComponent } from '../modal-cour/modal-cour.component';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cour',
  templateUrl: './cour.component.html',
  styleUrls: ['./cour.component.css']
})
export class CourComponent {
  displayedColumns: string[] = ['id', 'titre', 'description', 'formationId', 'action'];
  dataSource: Cour[] = [];

  constructor(private courService: CourService, private dialog: MatDialog ,   private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.fetchData();
    console.log(this.dataSource)
    
  }

  fetchData(): void {
    const formationSessionId = this.route.snapshot.params['id'];
  
    this.courService.getAllCoursBySessionId(formationSessionId).subscribe((data) => {
      console.log(data); // Ajoutez cette ligne pour inspecter la réponse
      // Assurez-vous que data est un tableau
      if (Array.isArray(data)) {
        this.dataSource = data;
      } else {
        console.error("Les données reçues ne sont pas un tableau.");
        this.dataSource = [];
      }
    });
  }
  

  open(): void {
    let dialogRef = this.dialog.open(ModalCourComponent, {
      height: '500px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.courService.addCours(data).subscribe(() => {
          console.log("Cours ajouté avec succès");
          this.fetchData();
        });
      }
    });
  }

  openEdit(id: number): void {
    this.courService.getCoursById(id).subscribe((cour) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = cour;

      let dialogRef = this.dialog.open(ModalCourComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.courService.updateCours(id, data).subscribe(() => {
            console.log("Cours modifié avec succès");
            this.fetchData();
          });
        }
      });
    });
  }

  deleteCours(id: number): void {
    let dialogRef = this.dialog.open(ConfirmdialogComponent, {
      height: '200px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courService.deleteCours(id).subscribe(() => {
          console.log("Cours supprimé");
          this.fetchData();
        });
      }
    });
  }
}
