import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Formation } from 'src/Models/Formation';
import { FormationService } from 'src/Services/formation.service';
import { ModalFormationComponent } from '../modal-formation/modal-formation.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
import { SharedService } from 'src/Services/shared.service';
import { SousCategorieService } from 'src/Services/sous-categorie.service';
import { AuthService } from '../authentification/auth.service';
import { Categorie } from 'src/Models/Categorie';
import { SousCategorie } from 'src/Models/SousCategorie';
import { CategorieService } from 'src/Services/categorie.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Import MatPaginator

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css']
})
export class FormationComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nomFormation', 'niveau', 'duree', 'action', 'image'];
  dataSource: Formation[] = [];
  allFormations: Formation[] = [];
  Categories: Categorie[] = [];
  sousCategories: SousCategorie[] = [];
  selectedCategory: Categorie | null = null;
  selectedCategories: string = '';
  selectedSubCategory: SousCategorie | null = null;
  // Pagination properties
  paginatedFormations: Formation[] = []; // Formations to display on the current page
  pageSize = 6; // Number of formations per page (adjust as needed)
  pageIndex = 0; // Current page index
  pageSizeOptions: number[] = [3, 6, 9, 12]; // Options for page size

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private FS: FormationService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private SCS: SousCategorieService,
    private As: AuthService,
    private CS: CategorieService
  ) {}

  ngOnInit(): void {
    this.fetchData();
    this.fetchCategories();

    // Subscribe to subcategory changes
    this.sharedService.selectedSousCategorieId$.subscribe((sousCategorieID) => {
      if (sousCategorieID) {
        this.filterFormations(sousCategorieID);
      } else {
        this.dataSource = this.allFormations;
        this.updatePaginatedFormations(); // Update pagination when dataSource changes
      }
    });

    // Subscribe to filtered formations (from search)
    this.sharedService.filteredFormations$.subscribe((filteredFormations) => {
      if (filteredFormations.length > 0) {
        this.dataSource = filteredFormations;
      } else {
        this.dataSource = this.allFormations;
      }
      this.updatePaginatedFormations(); // Update pagination when dataSource changes
    });
  }

  ngAfterViewInit(): void {
    // Set up pagination after the view is initialized
    this.paginator?.page.subscribe(() => {
      this.pageIndex = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      this.updatePaginatedFormations();
    });
    this.updatePaginatedFormations(); // Initial pagination
  }

  fetchData(): void {
    this.FS.getAllFormations().subscribe((data) => {
      this.allFormations = data;
      this.dataSource = data;
      this.updatePaginatedFormations(); // Update pagination when data is fetched
    });
  }

  filterFormations(sousCategorieID: number) {
    this.SCS.getFormations(sousCategorieID).subscribe((data) => {
      this.dataSource = data;
      this.sharedService.filteredFormations$.subscribe((filteredFormations) => {
        if (filteredFormations.length > 0) {
          this.dataSource = data.filter((formation) =>
            filteredFormations.some((f) => f.id === formation.id)
          );
        }
      });
      this.updatePaginatedFormations(); // Update pagination when dataSource changes
    });
  }

  // Update the paginated formations based on the current page and page size
  updatePaginatedFormations(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFormations = this.dataSource.slice(startIndex, endIndex);
  }

  open(): void {
    let dialogRef = this.dialog.open(ModalFormationComponent, {
      height: '500px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.FS.addFormation(data).subscribe(() => {
          console.log('Formation ajoutée avec succès');
          this.fetchData();
        });
      }
    });
  }

  openEdit(id: number): void {
    this.FS.getFormationById(id).subscribe((formation) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = formation;

      let dialogRef = this.dialog.open(ModalFormationComponent, dialogConfig);

      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.FS.updateFormation(id, data).subscribe(() => {
            console.log('Formation modifiée avec succès');
            this.fetchData();
          });
        }
      });
    });
  }

  deleteFormation(id: number): void {
    let dialogRef = this.dialog.open(ConfirmdialogComponent, {
      height: '200px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.FS.deleteFormation(id).subscribe(() => {
          console.log('Formation supprimée');
          this.fetchData();
        });
      }
    });
  }

  isAdmin(): boolean {
    return this.As.isAdmin();
  }

  fetchCategories(): void {
    this.CS.getAll().subscribe((data) => {
      this.Categories = data;
    });
  }

  onCategorieChange(categorieID: number): void {
    this.CS.getSousCategories(categorieID).subscribe((data) => {
      this.sousCategories = data;
    });
  }

  onSousCategorieChange(sousCategorieID: number) {
    this.sharedService.setSousCategorie(sousCategorieID);
  }



  // Select a category to show its subcategories
  selectCategory(category: Categorie): void {
    this.selectedCategory = category;
    this.selectedSubCategory = null; // Reset subcategory selection
    this.dataSource = this.allFormations; // Reset formations when selecting a new category
    this.onCategorieChange(category.id); // Fetch subcategories for the selected category
  }

  // Select a subcategory to filter formations
  selectSubCategory(subcategory: SousCategorie): void {
    this.selectedSubCategory = subcategory;
    this.sharedService.setSousCategorie(subcategory.id); // Update shared service
    this.filterFormations(subcategory.id);
  }

  // Reset to show all categories
  resetSelection(): void {
    this.selectedCategory = null;
    this.selectedSubCategory = null;
    this.sousCategories = []; // Clear subcategories
    this.dataSource = this.allFormations;
    this.sharedService.setSousCategorie(-1); // Reset shared service
  }
}