import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Feedback } from 'src/Models/Feedback';
import { FeedbackService } from 'src/Services/feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {

  feedbacks: Feedback[] = [];
  newFeedbackText: string = '';
  coursId=this.route.snapshot.params['id'];

  constructor(private feedbackService: FeedbackService, private route:ActivatedRoute ) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
   
    this.feedbackService.getFeedbacksByCourse(this.coursId).subscribe(data => {
      this.feedbacks = data;
        console.log('Feedbacks récupérés avec succès :', this.feedbacks);
        
    });
  }

  addFeedback(): void {
    if (!this.newFeedbackText.trim()) return;
    const newFeedback: Feedback = {
      id: this.feedbacks.length > 0 ? Math.max(...this.feedbacks.map(f => f.id)) + 1 : 1, // Générer un ID temporaire unique
      texte: this.newFeedbackText,
      dateCreation: new Date(),
      dateModification: new Date(),
      userId: 1, // À modifier dynamiquement
      coursId: this.coursId
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
}
