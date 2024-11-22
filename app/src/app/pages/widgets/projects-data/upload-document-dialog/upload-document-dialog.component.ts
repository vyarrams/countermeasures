import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-upload-document-dialog',
  templateUrl: './upload-document-dialog.component.html',
  styleUrls: ['./upload-document-dialog.component.scss']
})
export class UploadDocumentDialogComponent {

  constructor(
    private handler: ErrorHandlerService,
    private service: UserService,
    private auth: AuthService,
    private dialogRef: MatDialogRef<UploadDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  file: any;
  show_loading: boolean = false;

  fileUploaded(event: any) {
    this.file = event.target.files[0];
  }

  submitClicked() {
    if (!this.file) {
      this.handler.showErrorString('Please select a file to upload');
      return;
    }
    this.show_loading = true;
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('user_id', this.auth.getStoredUser()._id);
    this.service.uploadProjectDocument(this.data.project._id, formData).subscribe({
      next: (response: any) => {
        this.handler.showSuccess('Document uploaded successfully');
        this.dialogRef.close();
      },
      error: (error: any) => {
        this.handler.showErrorString(error.error.message);
      }
    });
  }

  // uploadProjectDocument
}
