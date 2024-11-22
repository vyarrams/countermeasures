import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './static/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { NavbarComponent } from './static-widgets/navbar/navbar.component';
import { FooterComponent } from './static-widgets/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';


import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatSidenavModule } from '@angular/material/sidenav';



import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthNavbarComponent } from './pages/widgets/auth-navbar/auth-navbar.component';
import { AuthFooterComponent } from './pages/widgets/auth-footer/auth-footer.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ModuleContainerComponent } from './pages/module-container/module-container.component';
import { EmptyComponent } from './pages/widgets/empty/empty.component';
import { AuthHandlerComponent } from './auth/auth-handler/auth-handler.component';
import { environment } from 'src/environments/environment';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SearchComponent } from './pages/search/search.component';
import { SideNavListComponent } from './pages/widgets/side-nav-list/side-nav-list.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { AddUserDialogComponent } from './pages/users/add-user-dialog/add-user-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { ProjectsDataComponent } from './pages/widgets/projects-data/projects-data.component';
import { AddProjectDialogComponent } from './pages/widgets/add-project-dialog/add-project-dialog.component';
import { DeleteConfirmationComponent } from './pages/widgets/delete-confirmation/delete-confirmation.component';
import { AddProjectComponent } from './pages/add-project/add-project.component';
import { EditProjectComponent } from './pages/edit-project/edit-project.component';
import { CountermeasureActionDialogComponent } from './pages/widgets/add-project-dialog/countermeasure-action-dialog/countermeasure-action-dialog.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { AddDepartmentDialogComponent } from './pages/departments/add-department-dialog/add-department-dialog.component';
import { PublishedProjectsComponent } from './pages/published-projects/published-projects.component';
import { LogoutConfirmationComponent } from './pages/widgets/logout-confirmation/logout-confirmation.component';
import { UploadDocumentDialogComponent } from './pages/widgets/projects-data/upload-document-dialog/upload-document-dialog.component';

// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    NavbarComponent,
    FooterComponent,
    DashboardComponent,
    AuthNavbarComponent,
    AuthFooterComponent,
    SettingsComponent,
    ModuleContainerComponent,
    EmptyComponent,
    AuthHandlerComponent,
    SearchComponent,
    SideNavListComponent,
    AdminDashboardComponent,
    UsersComponent,
    AddUserDialogComponent,
    ProjectsDataComponent,
    AddProjectDialogComponent,
    DeleteConfirmationComponent,
    AddProjectComponent,
    EditProjectComponent,
    CountermeasureActionDialogComponent,
    DepartmentsComponent,
    AddDepartmentDialogComponent,
    PublishedProjectsComponent,
    LogoutConfirmationComponent,
    UploadDocumentDialogComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    LottieModule.forRoot({ player: playerFactory }),
    MatDialogModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatListModule,
    MatTableModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
