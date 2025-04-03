import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Formation } from 'src/Models/Formation';
import { CertificatService } from 'src/Services/certificat.service';
import { FormationService } from 'src/Services/formation.service';

@Component({
  selector: 'app-certif-session',
  templateUrl: './certif-session.component.html',
  styleUrls: ['./certif-session.component.css']
})
export class CertifSessionComponent implements OnInit {
  formation?: Formation;
  certificat: any;
  formationID: any;

  constructor(
    private certificatService: CertificatService,
    private route: ActivatedRoute,
    private FS: FormationService
  ) {}

  ngOnInit(): void {
    this.loadCertificat();
  
  }
  
  loadCertificat(): void {
    const certificatId = this.route.snapshot.params['id'];
    this.certificatService.getCertificatById(certificatId).subscribe({
      next: (data) => {
        this.certificat = data;
        this.formationID = data.formation_session.formationID;
        console.log('Données du certificat:', data);
        this.fetchFormation();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du certificat:', err);
      }
    });
  }

  fetchFormation(): void {
    if (this.formationID) {
      this.FS.getFormationById(this.formationID).subscribe({
        next: (data) => {
          this.formation = data.formation;
          console.log('Formation récupérée avec succès:', this.formation);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de la formation:', err);
        }
      });
    } else {
      console.warn('formationID non défini, impossible de récupérer la formation.');
    }
  }
  generatePDF(): void {
    if (!this.certificat) {
      console.error('Aucun certificat trouvé.');
      return;
    }
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Certificat de Réussite', 20, 20);
    doc.setFontSize(12);
    doc.text(`Utilisateur: ${this.certificat.candidat.nom} ${this.certificat.candidat.prenom}`, 20, 40);
    doc.text(`Formation: ${this.formation?.nomFormation || 'N/A'}`, 20, 50);
    doc.text(`Date d'obtention: ${this.certificat.dateObtention}`, 20, 60);
    doc.text(`Note: ${this.certificat.note}`, 20, 70);
    doc.text(`Statut: ${this.certificat.statut}`, 20, 80);
    doc.text(`Créé le: ${this.certificat.created_at}`, 20, 90);
    doc.save('certificat.pdf');
  }
}
