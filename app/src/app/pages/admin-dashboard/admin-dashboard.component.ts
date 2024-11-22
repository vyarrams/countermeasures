import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserService } from 'src/app/services/user.service';
import { AddProjectDialogComponent } from '../widgets/add-project-dialog/add-project-dialog.component';
import { Title } from '@angular/platform-browser';
// takeUntil
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private dialog: MatDialog,
    private service: UserService,
    private handler: ErrorHandlerService,
    private title: Title
  ) {
    this.title.setTitle('Projects | Admin Dashboard');
  }

  projects: any = [];

  temp_file: any;

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects(): void {
    this.service.getAllProjects().subscribe({
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

  addProjectClicked(): void {
    this.dialog.open(AddProjectDialogComponent, {});
  }

  tempFileUpdated(event: any): void {
    console.log(event.target.files[0]);
    this.temp_file = event.target.files[0];
  }

  uploadTempFile(): void {
    const formData = new FormData();
    formData.append('data_name', 'temp_file');
    this.temp_file && formData.append('data_file', this.temp_file);
    if (!this.temp_file) {
      console.log('No file selected');
      return;
    }
    this.service.tempUpdateData(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (error: any) => {
          this.handler.handleError(error);
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }



}

