import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Categorie } from 'src/Models/Categorie';
import { CategorieService } from 'src/Services/categorie.service';
import { AuthService } from '../authentification/auth.service';
import { SousCategorieService } from 'src/Services/sous-categorie.service';
import { Formation } from 'src/Models/Formation';
import { SousCategorie } from 'src/Models/SousCategorie';
import { SharedService } from 'src/Services/shared.service';
import { FormationService } from 'src/Services/formation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

    selectedCategorie: number | null = null;
  selectedCategories: string = '';  // Pour stocker la catégorie sélectionnée
  filteredFormations: Formation[] = []; // To store filtered formations
  searchTerm: string = '';
  private lastSearchTerm: string = ''; // To track the last search term and avoid duplicate Snackbars
  userName: string = 'Inconnu';

  userData: any = {};


  
  // private authService: AuthService
  constructor(
    private formationService:FormationService,  private snackBar: MatSnackBar ,
    private router: Router,private sharedService: SharedService, private CS:CategorieService, private userService: AuthService) {
  
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
    this.userService.profil().subscribe({
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
    this.fetchFormations();
   


// Subscribe to subcategory changes
this.sharedService.selectedSousCategorieId$.subscribe((sousCategorieId) => {
  if (sousCategorieId) {
    this.filteredFormations = this.formations.filter(
      (formation) => formation.sousCategorieID === sousCategorieId
    );
  } else {
    this.filteredFormations = this.formations;
  }
});




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

  


  filterFormations(): void {
    if (!this.searchTerm) {
      this.filteredFormations = this.formations;
    } else {
      this.filteredFormations = this.formations.filter((formation) =>
        formation.nomFormation.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.sharedService.setFilteredFormations(this.filteredFormations);

    // Show Snackbar if no formations are found and the search term has changed
    if (this.filteredFormations.length === 0 && this.searchTerm && this.searchTerm !== this.lastSearchTerm) {
      this.snackBar.open(`Aucune formation trouvée pour "${this.searchTerm}".`, 'Fermer', {
        duration: 3000, // Duration in milliseconds (3 seconds)
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      this.lastSearchTerm = this.searchTerm; // Update the last search term
    } else if (this.filteredFormations.length > 0) {
      this.lastSearchTerm = ''; // Reset the last search term when formations are found
    }
  }
  fetchFormations(): void {
    this.formationService.getAllFormations().subscribe({
      next: (data) => {
        this.formations = data;
        this.filteredFormations = data;
        this.sharedService.setFilteredFormations(this.filteredFormations); // Share the initial formations
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des formations:', err);
        this.formations = [];
        this.filteredFormations = [];
        this.sharedService.setFilteredFormations(this.filteredFormations); // Share empty array on error
      }
    });
  }


  }

