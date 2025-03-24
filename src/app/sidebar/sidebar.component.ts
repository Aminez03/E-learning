import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Categorie } from 'src/Models/Categorie';
import { CategorieService } from 'src/Services/categorie.service';
import { AuthService } from '../authentification/auth.service';
import { SousCategorieService } from 'src/Services/sous-categorie.service';
import { Formation } from 'src/Models/Formation';
import { SousCategorie } from 'src/Models/SousCategorie';
import { SharedService } from 'src/Services/shared.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  displayedColumns: string[] = ['id', 'nomCategorie'];
    Categories: Categorie[]=[] 
    sousCategories: SousCategorie[] = []; // Pour stocker les sous-catégories
    formations: Formation[] = []; // Pour stocker les formations


  selectedCategorie: string = '';  // Pour stocker la catégorie sélectionnée



  userName: string = 'Inconnu';

  userData: any = {};


  
  // private authService: AuthService
  constructor(private router: Router,private sharedService: SharedService, private CS:CategorieService, private userService: AuthService) {
  
  }

  isProfileMenuOpen = false;

 toggleProfileMenu() {
  this.isProfileMenuOpen = !this.isProfileMenuOpen;
}

  logout() {
    // Add your logout logic here
    console.log('Logged out');
  }
  isDarkMode: boolean = false;

  // Method to toggle dark mode
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    
    // Toggle dark mode class on the body
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }


  loadUserProfile() {
    this.userService.profile().subscribe({
      next: (data) => {
        this.userData = data; // Stocke les données dans userData
        console.log(this.userData);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du profil:', err);
      }
    });
  }




  ngOnInit(): void {
    this.loadUserProfile();
    this.fetchData();
   
  }

  fetchData(): void {
    this.CS.getAll().subscribe((data) => {
  
        this.Categories=data;
      
    });
  }
  onCategorieChange(categorieID: number): void {
    this.CS.getSousCategories(categorieID).subscribe(data => {
      this.sousCategories = data;
    });
  }



  onSousCategorieChange(sousCategorieID: number) {
    this.sharedService.setSousCategorie(sousCategorieID);
  }



  }

