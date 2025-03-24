export interface Feedback {
    id: number;
    texte: string;
    dateCreation: Date;
    dateModification: Date;
    userId: number; // Clé étrangère
    coursId: number; // Clé étrangère
  }
  