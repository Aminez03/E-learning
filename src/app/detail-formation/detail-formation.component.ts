import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Formation } from 'src/Models/Formation';
import { Session } from 'src/Models/Session';
import { FormationService } from 'src/Services/formation.service';

@Component({
  selector: 'app-detail-formation',
  templateUrl: './detail-formation.component.html',
  styleUrls: ['./detail-formation.component.css']
})
export class DetailFormationComponent {
  formation: Formation | undefined;
  sessions: Session[] = [];

  constructor(
    private FS: FormationService,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    
    const formationId  = this.route.snapshot.params['id'];



    if (formationId ) {
      this.FS.getFormationById(formationId ).subscribe({
        next: (data) => {
          this.formation = data.formation;
          this.sessions = data.sessions;
          console.log('Formation récupérée avec succès :', this.formation);
          console.log('Sessions récupérées avec succès :', this.sessions);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des données :', err);
        },
      });
    }
  }




  

}