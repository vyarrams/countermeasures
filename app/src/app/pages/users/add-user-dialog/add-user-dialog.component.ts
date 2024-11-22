import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {

  constructor(
    private service: UserService,
    private auth: AuthService,
    private handler: ErrorHandlerService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  form = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', Validators.required],
    password: [''],
    assigned_departments: [[], Validators.required],
    view_only: [false, Validators.required]
  });

  edit_mode = false;
  departments: any = [];

  ngOnInit(): void {
    this.getDepartments();
    if (this.data?._id !== undefined) {
      console.log(this.data);
      this.edit_mode = true;
      this.form.patchValue({
        first_name: this.data.first_name,
        last_name: this.data.last_name,
        email: this.data.email,
        assigned_departments: this.data.assigned_departments,
        view_only: this.data.view_only
      });
    } else {
      this.form.get('password')?.setValidators(Validators.required);
    }
  }

  getDepartments(): void {
    this.service.getAllDepartments().subscribe({
      next: (data: any) => {
        this.departments = data;
      },
      error: (error: any) => {
        this.handler.handleError(error);
      }
    }); // add handler
  }

  onSubmit() {
    if (this.edit_mode) {
      this.editUser();
      return;
    } else {
      this.form.disable();
      this.auth.register(this.form.value).subscribe({
        next: (data: any) => {
          this.form.reset();
          this.form.enable();
          this.handler.showSuccess('User added successfully');
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          this.handler.handleError(error);
          this.form.enable();
        }
      });
    }
  }

  editUser() {
    this.service.updateUser({ _id: this.data._id, ...this.form.value }).subscribe({
      next: (data: any) => {
        this.form.reset();
        this.form.enable();
        this.handler.showSuccess('User updated successfully');
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        this.handler.handleError(error);
        this.form.enable();
      }
    });
  }

}
