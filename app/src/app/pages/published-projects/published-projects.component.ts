import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserService } from 'src/app/services/user.service';

// takeUntil
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-published-projects',
  templateUrl: './published-projects.component.html',
  styleUrls: ['./published-projects.component.scss']
})
export class PublishedProjectsComponent implements OnInit, OnDestroy {

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
    this.getProjects();
  }

  getProjects(): void {
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
    event ? this.getProjects() : 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
