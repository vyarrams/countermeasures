import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-countermeasure-action-dialog',
  templateUrl: './countermeasure-action-dialog.component.html',
  styleUrls: ['./countermeasure-action-dialog.component.scss']
})
export class CountermeasureActionDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public countermeasure: any,
  ) {
  }

}
