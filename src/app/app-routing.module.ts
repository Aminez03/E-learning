import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SessionComponent } from './session/session.component';
import { FormationComponent } from './formation/formation.component';
import { ModalFormationComponent } from './modal-formation/modal-formation.component';
import { DetailFormationComponent } from './detail-formation/detail-formation.component';
import { CourComponent } from './cour/cour.component';
import { DetailCourComponent } from './detail-cour/detail-cour.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './authentification/login/login.component';
import { RegisterComponent } from './authentification/register/register.component';
import { LogoutComponent } from './authentification/logout/logout.component';
import { DetailSessionComponent } from './detail-session/detail-session.component';

const routes: Routes = [
  { path: '', redirectTo: '/formations', pathMatch: 'full' },


  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },



  { path: 'home', component: HomeComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'sessions', component: SessionComponent },
  { path: 'formations', component: FormationComponent },
  {path:"cours",component:CourComponent},





  { path: 'contact', component:ContactComponent  },
  {
    path: 'detail-cour/:id', // Route pour afficher les détails d'un cours
    component: DetailCourComponent,
  },
  { path: 'modal-formation', component: ModalFormationComponent },
  { path: 'detail-formation/:id', component: DetailFormationComponent },

  { path: 'session/:id', component: DetailSessionComponent },


  { path: '**', redirectTo: '/home' } // Redirection vers Home en cas de route inconnue
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
