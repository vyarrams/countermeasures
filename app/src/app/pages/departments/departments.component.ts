import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserService } from 'src/app/services/user.service';
import { AddDepartmentDialogComponent } from './add-department-dialog/add-department-dialog.component';
// takeUntil
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private service: UserService,
    private handler: ErrorHandlerService,
    private title: Title,
    private dialog: MatDialog
  ) { }

  departments: any = [];

  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource(this.departments);

  ngOnInit(): void {
    this.title.setTitle('Departments');
    this.getDepartments();
  }

  getDepartments(): void {
    this.service.getAllDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.departments = data;
          this.dataSource = new MatTableDataSource(this.departments);
        },
        error: (error: any) => {
          this.handler.handleError(error);
        }
      });
  }

  addDepartmentClicked(): void {
    this.dialog.open(AddDepartmentDialogComponent).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          res ? this.getDepartments() : null;
        },
        error: (error: any) => {
          this.handler.handleError(error);
        }
      });
  }

  editClicked(department: any): void {
    this.dialog.open(AddDepartmentDialogComponent, {
      data: department
    }).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          res ? this.getDepartments() : null;
        },
        error: (error: any) => {
          this.handler.handleError(error);
        }
      });
  }

  deleteClicked(department: any): void {
    this.service.deleteDepartment(department._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.getDepartments();
        },
        error: (error: any) => {
          this.handler.handleError(error);
        },
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
