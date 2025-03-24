export interface Session {
    id: number;
    dateDebut: Date;
    dateFin: Date;
    statut: string;
    capacite: number;
    nombreInscrits: number;
    formationID: number; // Clé étrangère
    formateurID :number; // Clé étrangère
              
  }
  