import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserService } from 'src/app/services/user.service';

// takeUntil
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private service: UserService,
    private activatedRoute: ActivatedRoute,
    private handler: ErrorHandlerService,
    private title: Title
  ) {
    this.title.setTitle('Edit Project');
  }

  project: any = {};

  ngOnInit(): void {
    this.getParams();
  }

  getParams(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (params: any) => {
          this.getProject(params.id);
        },
        error: (error: any) => {
          this.handler.handleError(error);
        }
      }).unsubscribe();
  }

  getProject(id: string): void {
    this.service.getProject(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.project = response;
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
