import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamenService } from 'src/Services/examen.service';
import { Examen } from 'src/Models/Examen';
import { Question } from 'src/Models/Question';
import { Reponse } from 'src/Models/Reponse';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.css']
})
export class ExamenComponent implements OnInit {
  examen: Examen | null = null;
  questions: Question[] = [];
  reponses: { [key: number]: Reponse[] } = {};
  selectedReponses: { [key: number]: number[] } = {}; // Stocker plusieurs réponses par question
  correctAnswers: { [key: number]: number[] } = {}; // Stocke les réponses correctes pour chaque question
  showResults = false;
  hasStarted = false;
  errorMessage: string | null = null;
  scorefinal=0
  score = 0;
  totalNotes = 0;
  pourcentage = 0;
  certificatCree = false;
  message: string | null = null; // Message de résultat
  certificatid: number | null = null; // ID du certificat

  constructor(
    private examenService: ExamenService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,

  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.params['id'];
    this.loadExamen(sessionId);  
    console.log(this.selectedReponses);
    this.fetchAndNavigateToCertif();
  }

  loadExamen(sessionId: number): void {
    this.examenService.getExamenBySession(sessionId).subscribe(examen => {
      this.examen = examen;
      this.loadQuestions(examen.id);
    });
  }

  loadQuestions(examenId: number): void {
    this.examenService.getQuestionsByExamen(examenId).subscribe(
      (questions: any) => {
        if (Array.isArray(questions)) {
          this.questions = questions;
          this.errorMessage = null;
          this.questions.forEach(question => {
            this.loadReponses(question.id);
            this.selectedReponses[question.id] = [];
          });
        } else {
          this.errorMessage = questions;
          this.questions = [];
        }
      },
      (error) => {
        this.errorMessage = 'Problème de récupération des questions';
        this.questions = [];
      }
    );
  }

  loadReponses(questionId: number): void {
    this.examenService.getReponsesByQuestion(questionId).subscribe(reponses => {
      this.reponses[questionId] = reponses;
      this.correctAnswers[questionId] = reponses
        .filter(r => r.statut) // Filtrer les réponses correctes
        .map(r => r.id); // Stocker les IDs des réponses correctes
    });
  }

  startExam(): void {
    this.hasStarted = true;
  }

  finishExam(): void {
    this.calculateScore();
    this.showResults = true;

    // Appeler la méthode de calcul du score via l'API
    if (this.examen) {
      const token = localStorage.getItem('CC_Token');
      if (!token) {
        this.snackBar.open('Erreur: Token non trouvé. Veuillez vous connecter.', 'OK', { duration: 3000 });
        return;
      }


      const reponsesPayload = this.selectedReponses;

      this.examenService.calculerScore(this.examen.id, token,reponsesPayload).subscribe({
        next: (result: any) => {
          this.score = result.score;  // Mettre à jour le score
          this.totalNotes = result.total_notes;  // Nombre total de notes
          this.pourcentage = result.pourcentage;  // Pourcentage
          this.certificatCree = result.certificat_cree;  // Certificat créé
          this.message = result.message;  // Message de résultat
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du calcul du score';
          console.error('Erreur API:', err);
        }
      });
    }
  }

  calculateScore(): void {
    this.scorefinal = 0;

    this.questions.forEach(question => {
      const correct = this.correctAnswers[question.id] || [];
      const selected = this.selectedReponses[question.id] || [];

      if (question.type === 'multiple') {
        // Valider que toutes les réponses sélectionnées sont correctes et qu'aucune réponse incorrecte n'est choisie
        const allCorrect = selected.every(id => correct.includes(id));
        const noIncorrect = selected.every(id => !correct.includes(id));

        if (selected.length > 0 && allCorrect && noIncorrect) {
          this.scorefinal++;
        }
      } else if (question.type === 'seule réponse') {
        if (selected.length === 1 && correct.includes(selected[0])) {
          this.scorefinal++;
        }
      }
    });
    console.log('Score final calculé:', this.scorefinal);
  }

  toggleSelection(questionId: number, reponseId: number): void {
    const index = this.selectedReponses[questionId].indexOf(reponseId);
    if (index > -1) {
      this.selectedReponses[questionId].splice(index, 1);
    } else {
      this.selectedReponses[questionId].push(reponseId);
    }
  }

  selectUnique(questionId: number, reponseId: number): void {
    this.selectedReponses[questionId] = [reponseId]; 
  }

  fetchAndNavigateToCertif(): void {
    const token = localStorage.getItem('CC_Token'); // Retrieve the token
    if (!token) {
      console.error('Token non trouvé');
      this.snackBar.open('Erreur: Token non trouvé. Veuillez vous connecter.', 'OK', { duration: 3000 });
      return;
    }
    this.examenService.getUserCertificats(token).subscribe({
      next: (certificats: any[]) => {
        if (certificats.length > 0) {
          const certificatId = certificats[0].id;
          this. certificatid=certificatId;// Assuming you want to navigate to the first certificate
          console.log('Certificat ID:', certificatId);
        } else {
          this.snackBar.open('Aucun certificat trouvé.', 'OK', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des certificats:', err);
        this.snackBar.open('Erreur lors de la récupération des certificats.', 'OK', { duration: 3000 });
      }
    });
  }
  

}
