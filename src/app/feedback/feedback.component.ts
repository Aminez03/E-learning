import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Feedback } from 'src/Models/Feedback';
import { FeedbackService } from 'src/Services/feedback.service';
import { AuthService } from 'src/app/authentification/auth.service'; // Import AuthService

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {


  feedbacks: Feedback[] = [];
  newFeedbackText: string = '';
  formationSessionId = this.route.snapshot.params['id'];
  candidatData: any | undefined; // Store userId
  avatarUrl: any[] = []; // Declare avatarUrl property

  constructor(
    private feedbackService: FeedbackService,
    private route: ActivatedRoute,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
     this.loadUserId();
    this.loadFeedbacks();
  
  }

  loadFeedbacks(): void {
    this.feedbackService.getFeedbacksBySession(this.formationSessionId).subscribe(data => {
      this.feedbacks = data;
  
      // Charger les avatars pour chaque utilisateur
      this.feedbacks.forEach(feedback => {
        this.authService.getUserByID(feedback.candidatID).subscribe(user => {
          feedback['avatarUrl'] = user?.user.avatar || 'assets/default-avatar.png'; // Image par défaut
          feedback['nom'] = user?.user.nom ; // Image par défaut
        });
      });
  
      console.log('Feedbacks récupérés avec succès :', this.feedbacks);
    });
  }
  

  loadUserId() {
    this.authService.profile().subscribe({
      next: (data) => {
        this.candidatData = data; // Stocke les données dans userData
        console.log(this.candidatData);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du profil:', err);
      }
    });
  }

  addFeedback(): void {
    if (!this.newFeedbackText.trim()) return;
    const newFeedback: Feedback = {
      texte: this.newFeedbackText,
      candidatID: this.candidatData.id,
      formationSessionID: this.formationSessionId,

    };

    this.feedbackService.addFeedback(newFeedback).subscribe(feedback => {
      this.feedbacks.push(feedback);
      this.newFeedbackText = '';
    });
  }

  deleteFeedback(id: number): void {
    this.feedbackService.deleteFeedback(id).subscribe(() => {
      this.feedbacks = this.feedbacks.filter(f => f.id !== id);
    });
  }




  getuserbyid(id: number) {
    this.authService.getUserByID(id).subscribe((user) => {
      return user.user;
    });
  }

  }
  


