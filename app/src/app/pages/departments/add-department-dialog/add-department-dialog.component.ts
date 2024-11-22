import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserService } from 'src/app/services/user.service';
// takeUntil
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-department-dialog',
  templateUrl: './add-department-dialog.component.html',
  styleUrls: ['./add-department-dialog.component.scss']
})
export class AddDepartmentDialogComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  edit_mode = false;

  constructor(
    private handler: ErrorHandlerService,
    private service: UserService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDepartmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  form = this.fb.group({
    name: ['', Validators.required]
  });

  ngOnInit(): void {
    if (this.data) {
      this.edit_mode = true;
      this.form.patchValue(this.data);
    }
  }

  addDepartment(): void {
    if (this.edit_mode) {
      this.editDepartment();
      return;
    }
    this.form.disable();
    this.service.addDepartment(this.form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          this.handler.handleError(error);
          this.form.enable();
        }
      });
  }

  editDepartment(): void {
    this.form.disable();
    this.service.updateDepartment(this.data._id, this.form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          this.handler.handleError(error);
          this.form.enable();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
