import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';

import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginAuthGuard } from './guards/login-auth.guard';
import { HomeComponent } from './static/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ModuleContainerComponent } from './pages/module-container/module-container.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AuthHandlerComponent } from './auth/auth-handler/auth-handler.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { AddProjectDialogComponent } from './pages/widgets/add-project-dialog/add-project-dialog.component';
import { AddProjectComponent } from './pages/add-project/add-project.component';
import { EditProjectComponent } from './pages/edit-project/edit-project.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { PublishedProjectsComponent } from './pages/published-projects/published-projects.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [LoginAuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginAuthGuard],
  },

  {
    path: '',
    component: ModuleContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'published-projects',
        component: PublishedProjectsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'add-project',
        component: AddProjectComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'edit-project/:id',
        component: EditProjectComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'departments',
        component: DepartmentsComponent,
        canActivate: [AuthGuard],
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
  providers: [AuthGuard, LoginAuthGuard,]
})
export class AppRoutingModule { }
