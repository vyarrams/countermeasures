import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { Title } from '@angular/platform-browser';

// takeUntil
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(
    private dialog: MatDialog,
    private service: UserService,
    private handler: ErrorHandlerService,
    private title: Title
  ) {
    this.title.setTitle('Users');
  }

  users: any = [];

  displayedColumns: string[] = ['first_name', 'last_name', 'email', 'departments', 'actions'];
  dataSource = new MatTableDataSource(this.users);


  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.service.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.users = data;
          this.dataSource = new MatTableDataSource(this.users);
        },
        error: (error: any) => {
          this.handler.handleError(error);
        }
      });
  }

  addUserClicked(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '500px',
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.getUsers();
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editUserClicked(user: any): void {
    this.dialog.open(AddUserDialogComponent, { data: user }).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          if (result) {
            this.getUsers();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
