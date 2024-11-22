import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserService } from 'src/app/services/user.service';
import { AddProjectDialogComponent } from '../widgets/add-project-dialog/add-project-dialog.component';

// takeUntil
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(
    private service: UserService,
    private handler: ErrorHandlerService,
    private router: Router,
    private title: Title,
    private auth: AuthService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.title.setTitle('Dashboard | Projects');
  }

  user: any;
  projects: any = [];


  ngOnInit(): void {
    this.user = this.auth.getStoredUser();
    this.user?.view_only ? this.getViewOnlyProjects() : this.getProjects();
  }

  getProjects(): void {
    this.service.getAgentProjects(this.user?._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.projects = response;
        },
        error: (error: any) => {
          this.handler.handleError(error);
        }
      });
  }

  getViewOnlyProjects(): void {
    this.service.getViewOnlyProjects(this.user?._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.projects = response;
        },
        error: (error: any) => {
          this.handler.handleError(error);
        }
      });
  }

  projectEdited(event: any): void {
    console.log(event);
    event ? this.getProjects() : 0;
  }

  addProjectClicked(): void {
    this.dialog.open(AddProjectDialogComponent, {});
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }




}
