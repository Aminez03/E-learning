import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contact = {
    name: '',
    email: '',
    number: '',
    message: ''
  };

  searchTerm: string = '';

  onSubmit() {
    console.log('Form submitted:', this.contact);
    // Ajouter la logique pour traiter le formulaire
    alert('Thank you for contacting us!');
    this.contact = { name: '', email: '', number: '', message: '' };
  }

  onSearch() {
    console.log('Search term:', this.searchTerm);
    // Logique pour traiter la recherche
  }

  toggleMenu() {
    console.log('Toggling menu');
    // Logique pour gérer l'affichage du menu
  }

  toggleTheme() {
    console.log('Toggling theme');
    // Logique pour activer le mode clair/sombre
  }
}