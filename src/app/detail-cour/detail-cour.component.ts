import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cour } from 'src/Models/Cour';
import { CourService } from 'src/Services/cour.service';

@Component({
  selector: 'app-detail-cour',
  templateUrl: './detail-cour.component.html',
  styleUrls: ['./detail-cour.component.css']
})
export class DetailCourComponent {
  cour: Cour | undefined; // Détails du cours
  isLoading = true; // Indicateur de chargement
  errorMessage: string | null = null; // Message d'erreur

  constructor(
    private route: ActivatedRoute, // Pour récupérer l'ID du cours depuis l'URL
    private courService: CourService // Service pour récupérer les données
  ) {}

  ngOnInit(): void {
    const courId = this.route.snapshot.params['id']; // Récupérer l'ID du cours depuis l'URL
    if (courId) {
      this.loadCourById(courId); // Charger les détails du cours
    } else {
      this.errorMessage = 'ID du cours non valide.';
      this.isLoading = false;
    }
  }

  // Charger les détails du cours par son ID
  loadCourById(courId: number): void {
    this.courService.getCoursById(courId).subscribe({
      next: (data) => {
        this.cour = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des détails du cours.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }
}