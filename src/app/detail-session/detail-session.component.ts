import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from 'mongodb';
import { SessionService } from 'src/Services/session.service';
import { AuthService } from '../authentification/auth.service';

@Component({
  selector: 'app-detail-session',
  templateUrl: './detail-session.component.html',
  styleUrls: ['./detail-session.component.css']
})
export class DetailSessionComponent {
  session: any;
  formateur: any | null = null;
  candidats: any[] = [];
  errorMessage: string = '';
  token: string = ''; // Récupérer le token depuis le localStorage
  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private userService: AuthService,
  ) {}
  displayedColumns: string[] = [ 'nom', 'email', 'role', 'actions'];
  ngOnInit() {
    const token = localStorage.getItem('CC_Token'); // Récupère le token du localStorage
    if (token) {
      this.token = token;
    }


    const sessionId = this.route.snapshot.paramMap.get('id'); 
    if (sessionId) {
      this.getSessionById(parseInt(sessionId, 10));
  
      // Charger les candidats
      this.sessionService.getAllCandidatsBySessionId(parseInt(sessionId, 10)).subscribe({
        next: (data) => {
          this.candidats = data; 
          console.log('Candidats récupérés :', this.candidats);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des candidats :', err);
        }
      });
    }
  }
  getSessionById(id: number) {
    this.sessionService.getById(id).subscribe(
      (data) => {
        this.session = data;
        if (this.session && this.session.formateurID) {
          this.getFormateurDetails(this.session.formateurID);
       
        }else{
          console.error('Erreur lors de la récupération de la session :', 'Formateur ID non trouvé');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération de la session :', error);
      }
    );
  }
  

  getFormateurDetails(formateurID: number): void {
    this.userService.getUserByID(formateurID).subscribe((user) => {
      this.formateur = user.user;
    });
  }
 
  blockUser(id: number) {
    this.userService.blockUser(id, this.token).subscribe({
      next: (response) => {
        alert(response.message); // Message de succès
      },
      error: (err) => {
        alert('Erreur: ' + err.error.message);
      }
    });
  }
  isAdmin(): boolean {
    return this.userService.isAdmin();
  }

}