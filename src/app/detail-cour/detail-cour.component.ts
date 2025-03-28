import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Cour } from 'src/Models/Cour';
import { Session } from 'src/Models/Session';
import { SessionProgression } from 'src/Models/SessionProgression';
import { CourService } from 'src/Services/cour.service';
import { SessionProgressionService } from 'src/Services/session-progression.service';
import { SessionService } from 'src/Services/session.service';

@Component({
  selector: 'app-detail-cour',
  templateUrl: './detail-cour.component.html',
  styleUrls: ['./detail-cour.component.css']
})
export class DetailCourComponent implements OnInit {
  cour?: Cour; 
  session?: Session;
  progression?: SessionProgression;

  isLoading = true;
  errorMessage: string | null = null;
  progressionValue = 0;
  mode: 'determinate' | 'indeterminate' = 'indeterminate';
  
  constructor(
    private route: ActivatedRoute,
    private courService: CourService,
    private sessionProgressionService: SessionProgressionService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
this.loadCourId();


  }
  loadCourId(): void{
    const courId = this.route.snapshot.params['id'];
    if (courId) {
      this.loadCourDetails(courId);
    } else {
      this.setErrorMessage('ID du cours non valide.');
    }}
  // Charger les détails du cours et de la session en parallèle
  private loadCourDetails(courId: number): void {
    this.isLoading = true;
    this.courService.getCoursById(courId).subscribe({
      next: (courData) => {
        this.cour = courData;
        if (this.cour?.formationSessionID) {
          this.loadSessionAndProgression(this.cour.formationSessionID);
        } else {
          this.setErrorMessage('Session ID manquant pour ce cours.');
        }
      },
      error: (err) => this.setErrorMessage('Erreur lors du chargement du cours.', err)
    });
  }
  // Charger la session et la progression en parallèle pour éviter les appels successifs
  private loadSessionAndProgression(sessionId: number): void {
    forkJoin({
      session: this.sessionService.getById(sessionId),
      progression: this.sessionProgressionService.getProgression(sessionId)
    }).subscribe({
      next: ({ session, progression }) => {
        this.session = session;
        this.progression = progression;
        this.calculateProgressionPercentage();
        this.mode = 'determinate';
        this.isLoading = false;
      },
      error: (err) => this.setErrorMessage('Erreur lors du chargement des données de session et progression.', err)
    });
  }
  // Calculer le pourcentage de progression
  private calculateProgressionPercentage(): void {
    const totalCourses = this.session?.nombreCours || 1;
    this.progressionValue = this.progression ? Math.round((this.progression.progression / totalCourses) * 100) : 0;
  }

 // Mettre à jour la progression lorsqu'une vidéo est regardée
updateProgression(): void {
  if (!this.progression || !this.cour?.formationSessionID) return;
  const newCourID = this.cour.id; // ID du cours en cours de visionnage
  this.sessionProgressionService.updateProgression(this.cour.formationSessionID, newCourID).subscribe({
    next: (data) => {
      if (data?.progression !== undefined) {
        this.progression = data.progression;
        this.calculateProgressionPercentage();
        console.log('Progression mise à jour:', this.progression);
      } else {
        console.error('Format de réponse inattendu:', data);
      }
    },
    error: (err) => this.setErrorMessage('Erreur lors de la mise à jour de la progression.', err)
  });
  this.progressionValue;
}
  // Gestion du clic sur la vidéo
  onVideoClick(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    if (videoElement.paused) {
      this.updateProgression();
    }
  }

  // Centralisation de la gestion des erreurs
  private setErrorMessage(message: string, error?: any): void {
    this.errorMessage = message;
    this.isLoading = false;
    console.error(message, error);
  }
}
