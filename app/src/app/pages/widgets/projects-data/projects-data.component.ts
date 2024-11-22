import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserService } from 'src/app/services/user.service';
import { AddProjectDialogComponent } from '../add-project-dialog/add-project-dialog.component';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { Router } from '@angular/router';
import { UploadDocumentDialogComponent } from './upload-document-dialog/upload-document-dialog.component';

// takeUntil
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-projects-data',
  templateUrl: './projects-data.component.html',
  styleUrls: ['./projects-data.component.scss']
})
export class ProjectsDataComponent implements OnInit, OnChanges, OnDestroy {

  @Input() projects: any = [];
  @Input() view_only: boolean = false;

  destroy$: Subject<boolean> = new Subject<boolean>();

  @Output() editProject = new EventEmitter<any>();

  constructor(
    private dialog: MatDialog,
    private service: UserService,
    private auth: AuthService,
    private handler: ErrorHandlerService,
    private router: Router,
  ) { }

  displayedColumns: string[] = ['roadway', 'department', 'from', 'to', 'added_by', 'last_edited', 'actions'];
  dataSource = new MatTableDataSource();

  ngOnInit(): void {
    console.log(this.projects);
    if (this.projects.length > 0) {
      this.dataSource = new MatTableDataSource(this.projects);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['projects'] && this.projects) {
      this.dataSource = new MatTableDataSource(this.projects);
    }
  }

  editProjectClicked(project: any) {
    if (this.view_only) {
      this.handler.showErrorString('You do not have permission to edit this project');
      return;
    }
    this.router.navigate(['/edit-project', project._id]);
  }

  deleteProjectClicked(project: any) {
    if (this.view_only) {
      this.handler.showErrorString('You do not have permission to delete this project');
      return;
    }
    this.dialog.open(DeleteConfirmationComponent).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result) {
            this.service.deleteProject(project._id)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (response: any) => {
                  this.editProject.emit(true);
                },
                error: (error: any) => {
                  this.handler.handleError(error);
                }
              });
          }
        },
        error: (err) => {
          this.handler.handleError(err);
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  downloadPDfClicked(project: any) {
    this.service.downloadProjectPdf(project._id);
  }

  uploadPDFClicked(project: any) {
    this.dialog.open(UploadDocumentDialogComponent, { data: { project: project } }).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result) {
            this.editProject.emit(true);
          }
        },
        error: (err) => {
          this.handler.handleError(err);
        }
      });
  }
  downloadPDFClicked(element: any) {
    // element.uploaded_document
    window.open(element.uploaded_document, '_blank');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
