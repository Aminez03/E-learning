import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Modules Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';

// FlexLayout pour la mise en page


// Routing
import { AppRoutingModule } from './app-routing.module';

// Composants
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SessionComponent } from './session/session.component';
import { FormationComponent } from './formation/formation.component';
import { ModalFormationComponent } from './modal-formation/modal-formation.component';
import { DetailFormationComponent } from './detail-formation/detail-formation.component';
import { CourComponent } from './cour/cour.component';

import { ModalCourComponent } from './modal-cour/modal-cour.component';
import { ConfirmdialogComponent } from './confirmdialog/confirmdialog.component';
import { DetailCourComponent } from './detail-cour/detail-cour.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeedbackComponent } from './feedback/feedback.component';
import { ContactComponent } from './contact/contact.component';

import { RegisterComponent } from './authentification/register/register.component';
import { MatSelectModule } from '@angular/material/select';
import { LoginComponent } from './authentification/login/login.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';


// Import du module FilePond
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import * as FilePondPluginImagePreview from 'filepond-plugin-image-preview';


import { UploadImageComponent } from './upload-image/upload-image.component';

// Enregistrer le plugin FilePond (obligatoire pour la gestion des images)
registerPlugin(FilePondPluginImagePreview);



@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    SessionComponent,
    FormationComponent,
    ModalFormationComponent,
    DetailFormationComponent,
    CourComponent,
    ModalCourComponent,
         ConfirmdialogComponent,
         DetailCourComponent,
         FeedbackComponent,
         ContactComponent,
        LoginComponent,
         RegisterComponent,
         UploadImageComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,

    
    // Angular Material Modules
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatNativeDateModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatProgressSpinnerModule, 
    MatSelectModule,
    MatSnackBarModule,
    FilePondModule,
  
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Ajoute CUSTOM_ELEMENTS_SCHEMA
})
export class AppModule { }
