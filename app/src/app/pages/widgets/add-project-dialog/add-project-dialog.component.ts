import { Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserService } from 'src/app/services/user.service';
import { CountermeasureActionDialogComponent } from './countermeasure-action-dialog/countermeasure-action-dialog.component';
import { Router } from '@angular/router';

// takeUntil
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.scss']
})
export class AddProjectDialogComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private service: UserService,
    private auth: AuthService,
    private handler: ErrorHandlerService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  @Input() data: any;


  user = this.auth.getStoredUser();
  @ViewChild('fileInput') fileInput?: ElementRef;

  project_form = this.fb.group({
    roadway_name: ['', Validators.required],
    from: [''],
    to: [''],
    city: [''],
    parish: [''],
    control_section: [''],
    begin_mile: [''],
    end_mile: [''],
    description: [''],
    location: [''],
    latitude: [''],
    longitude: [''],
    coords: [''],
    roadway_area_type: [[]],
    roadway_classification: [[]],
    focus_area: [[]],
    average_annual_day_traffic_vehicular_volume: [[]],
    problems_to_be_addressed: [[]],
    crash_types_being_targeted: [[]],
    countermeasures: this.fb.array([]),
    total_project_cost: [0],
    total_savings_in_crash_reduction: [''],
    benefit_cost_ratio: [''],
    notes: [''],
    added_by: [this.user._id, Validators.required],
    department: ['', Validators.required],
    is_published: [false],
    last_edited_by: [this.user._id, Validators.required],
  });

  file: any;
  uploaded_file_deleted = false;
  get countermeasures(): FormArray {
    return this.project_form.get('countermeasures') as FormArray;
  }

  roadway_area_types: any = [];
  roadway_classifications: any = [];
  focus_areas: any = [];
  average_annual_day_traffic_vehicular_volumes: any = [];
  problems_to_be_addressed: any = [];
  crash_types_being_targeted: any = [];

  countermeasures_master: any = [];
  display_countermeasures: any = [];

  edit_mode = false;

  map: any;
  marker: any = null;
  edit_display_countermeasures: any = [];
  user_departments: any = [];
  show_department_select = false;
  show_form_loading = false;

  ngOnInit(): void {
    this.getDepartments();
    this.project_form.disable();
    const user = this.auth.getStoredUser();
    // check if user departments are more than 1
    if (user.assigned_departments.length == 1) {
      this.project_form.controls.department.setValue(user.assigned_departments[0]);
      this.project_form.controls.department.setValidators(Validators.required);
      user?.is_admin ? this.show_department_select = true : this.show_department_select = false;
    } else if (user.assigned_departments.length > 1) {
      this.show_department_select = true;
      this.project_form.controls.department.setValidators(Validators.required);
    } else {
      if (user?.is_admin) { this.show_department_select = true } else { this.show_department_select = false; this.handler.showErrorString('You are not assigned to any department'); this.project_form.disable(); }
    }

    this.getAllFilterData();

    setTimeout(() => {
      if (this.data && this.data !== null) {

        this.edit_mode = true;
        this.data ? this.project_form.patchValue(this.data) : null;
        this.data?.countermeasures?.forEach((element: any) => {
          this.countermeasures.push(this.fb.group({
            ref_value: [element.ref_value],
            countermeasure: [element.countermeasure, Validators.required],
            total_implementation_cost: [element.total_implementation_cost, Validators.required],
            comments: [element.comments],
          }));
        });

        this.setEditDisplayCountermeasures();

        user.is_admin ? this.getDepartments() : null;

        // Set marker position
        // let latLng = new google.maps.LatLng(this.data.latitude, this.data.longitude);
        // this.setMarkerPosition(latLng);

        let map_properties;
        map_properties = {
          center: new google.maps.LatLng(this.data.latitude, this.data.longitude),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(document.getElementById('map'), map_properties);
        this.initializeMapClick();
        this.project_form.enable();

      }
      else {

        let map_properties;
        map_properties = {
          center: new google.maps.LatLng(30.472309, -91.1407934),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(document.getElementById('map'), map_properties);
        this.initializeMapClick();
        this.project_form.enable();

      }
    }, 800);

  }


  getDepartments() {
    this.service.getAllDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          !this.user.is_admin ? this.user_departments = result.filter((element: any) => this.user.assigned_departments.includes(element._id)) : this.user_departments = result;
        },
        error: (error: any) => {
          this.handler.handleError(error);
        }
      });
  }

  initializeMapClick() {
    this.map.addListener('click', (event: any) => {
      this.setMarkerPosition(event.latLng);
    });
    if (this.edit_mode) {
      let latLng = new google.maps.LatLng(this.data.latitude, this.data.longitude);
      this.setMarkerPosition(latLng);
    }
  }

  setMarkerPosition(latLng: any) {
    if (this.marker) {
      this.marker.setPosition(latLng);
    } else {
      // If marker doesn't exist, create a new one
      this.marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
      });
    }
    console.log('Marker position set to: ', latLng.toJSON());

    this.project_form.controls.coords.setValue(latLng.toJSON());
    this.project_form.controls.latitude.setValue(latLng.lat());
    this.project_form.controls.longitude.setValue(latLng.lng());
  }

  addCountermeasureClicked(countermeasure: any) {
    this.dialog.open(CountermeasureActionDialogComponent, { data: countermeasure }).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          let insert = true;
          this.countermeasures.value.forEach((element: any) => {
            if (element.countermeasure === countermeasure?.name) {
              this.handler.showErrorString('Countermeasure already added');
              insert = false;
              return;
            }
          });
          if (!insert) {
            return;
          } else {
            // Add countermeasure to form array if result is true and countermeasure is not already in the array
            this.countermeasures.push(this.fb.group({
              ref_value: [countermeasure?.ref_value],
              countermeasure: [countermeasure?.name, Validators.required],
              total_implementation_cost: [0, Validators.required],
              comments: [''],
            }));
            this.display_countermeasures.forEach((element: any) => {
              if (element.name === countermeasure?.name) {
                element.selected = true;
              }
            });
          }
        }
      });
  }

  removeCountermeasureClicked(index: number, countermeasure: any) {
    this.display_countermeasures.forEach((element: any) => {
      if (element.ref_value === countermeasure.ref_value) {
        element.selected = false;
      }
    }
    );
    this.deleteCountermeasure(index, countermeasure);
  }
  addCountermeasure() {
    this.countermeasures.push(this.fb.group({
      ref_value: [null],
      countermeasure: ['', Validators.required],
      total_implementation_cost: [0, Validators.required],
      comments: [''],
    }));
  }

  getAllFilterData() {
    this.service.getAllFilterData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.roadway_area_types = result.roadway_area_type;
          this.roadway_classifications = result.roadway_classification;
          this.focus_areas = result.focus_area;
          this.average_annual_day_traffic_vehicular_volumes = result.aadtvv;
          this.problems_to_be_addressed = result.problems_to_be_addressed;
          this.crash_types_being_targeted = result.target_crash_type;
          // add selected to countermeasures
          this.countermeasures_master = result.countermeasures.map((element: any) => { return { ...element, selected: false } });
        },
        error: (error: any) => {
          this.handler.handleError(error);
        }
      });
  }

  setEditDisplayCountermeasures() {
    this.countermeasures.value.forEach((element: any) => {
      const countermeasure_original = this.countermeasures_master.find((item: any) => item.name.toString() === element.countermeasure.toString());
      if (countermeasure_original === undefined) {
        return;
      }
      countermeasure_original.selected = true;
      this.edit_display_countermeasures.push(countermeasure_original);
    });
    this.filterSelectionChanged();
  }


  filterSelectionChanged() {
    // Define countermeasure arrays for each category
    let roadway_area_type_countermeasures: any = [];
    let roadway_classification_countermeasures: any = [];
    let focus_area_countermeasures: any = [];
    let average_annual_day_traffic_vehicular_volume_countermeasures: any = [];
    let problems_to_be_addressed_countermeasures: any = [];
    let crash_types_being_targeted_countermeasures: any = [];

    // Process each selection if it has been made
    this.processSelection(this.project_form.controls.roadway_area_type.value, this.roadway_area_types, roadway_area_type_countermeasures);
    this.processSelection(this.project_form.controls.roadway_classification.value, this.roadway_classifications, roadway_classification_countermeasures);
    this.processSelection(this.project_form.controls.focus_area.value, this.focus_areas, focus_area_countermeasures);
    this.processSelection(this.project_form.controls.average_annual_day_traffic_vehicular_volume.value, this.average_annual_day_traffic_vehicular_volumes, average_annual_day_traffic_vehicular_volume_countermeasures);
    this.processSelection(this.project_form.controls.problems_to_be_addressed.value, this.problems_to_be_addressed, problems_to_be_addressed_countermeasures);
    this.processSelection(this.project_form.controls.crash_types_being_targeted.value, this.crash_types_being_targeted, crash_types_being_targeted_countermeasures);

    // Find common countermeasures among all selected categories
    let common_countermeasures = this.findCommonCountermeasures([
      roadway_area_type_countermeasures,
      roadway_classification_countermeasures,
      focus_area_countermeasures,
      average_annual_day_traffic_vehicular_volume_countermeasures,
      problems_to_be_addressed_countermeasures,
      crash_types_being_targeted_countermeasures,
    ]);
    // unique countermeasures using set
    let unique_countermeasures = [...new Set(common_countermeasures)];
    this.display_countermeasures = this.countermeasures_master.filter((element: any) => unique_countermeasures.includes(element.ref_value));
    // from edit_display_countermeasures set selected to true
    this.edit_display_countermeasures?.forEach((element: any) => {
      this.display_countermeasures.forEach((item: any) => {
        if (item.ref_value === element.ref_value) {
          item.selected = true;
        }
      });
    });
  }

  // Utility function to process each selection
  processSelection(selectedItems: any, allItems: any, countermeasuresArray: any) {
    if (selectedItems) {
      selectedItems.forEach((element: any) => {
        allItems?.forEach((item: any) => {
          if (item._id === element) {
            countermeasuresArray.push(...item.countermeasures);
          }
        });
      });
    }
  }

  // Utility function to find common countermeasures
  findCommonCountermeasures(countermeasuresArrays: any) {
    // Filter out empty arrays
    let nonEmptyArrays = countermeasuresArrays.filter((arr: any) => arr.length > 0);

    if (nonEmptyArrays.length === 0) {
      return [];
    }

    // If only one array is non-empty, return its contents
    if (nonEmptyArrays.length === 1) {
      return nonEmptyArrays[0];
    }

    // Find common elements in all non-empty arrays
    return nonEmptyArrays.reduce((a: any, b: any) => a.filter((c: any) => b.includes(c)));
  }


  deleteCountermeasure(index: number, countermeasure: any) {
    (this.project_form.controls.countermeasures as unknown as FormArray).removeAt(index);
    this.display_countermeasures.forEach((element: any) => {
      if (element.ref_value === countermeasure.value.ref_value) {
        element.selected = false;
      }
    });
  }


  calculateTotalProjectCost() {
    let total = 0;
    this.countermeasures.value.forEach((element: any) => {
      total += element.total_implementation_cost as number;
    });
    this.project_form.controls.total_project_cost.setValue(total);
  }

  fileUploaded(event: any): void {
    this.file = event.target.files[0];
  }

  submitClicked() {
    this.project_form.disable();
    const formData = this.buildFormData();
    this.service.addProject(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.handler.showSuccess('Project added successfully');
          this.project_form.enable();
          this.project_form.reset();
          // reset countermeasures
          this.display_countermeasures.forEach((element: any) => {
            element.selected = false;
          });
          // empty edit_display_countermeasures
          this.edit_display_countermeasures = [];
          this.display_countermeasures = [];
          this.countermeasures.clear();
          this.file = null;
          this.marker.setMap(null);
          this.marker = null;
        },
        error: (error: any) => {
          this.handler.handleError(error);
          this.project_form.enable();
        }
      });
  }

  updateClicked() {
    this.project_form.disable();
    const formData = this.buildFormData();
    this.service.updateProject(this.data._id, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.handler.showSuccess('Project updated successfully');
          this.project_form.enable();
          this.project_form.reset();
          // reset countermeasures
          this.display_countermeasures.forEach((element: any) => {
            element.selected = false;
          });
          // empty edit_display_countermeasures
          this.edit_display_countermeasures = [];
          this.display_countermeasures = [];
          this.countermeasures.clear();
          this.file = null;
          this.marker.setMap(null);
          this.marker = null;
        },
        error: (error: any) => {
          this.handler.handleError(error);
          this.project_form.enable();
        }
      });
  }

  buildFormData(): FormData {
    const formData = new FormData();
    this.file ? formData.append('uploaded_document', this.file) : this.uploaded_file_deleted ? formData.append('uploaded_document', '') : null;
    const roadwayName = this.project_form.controls.roadway_name.value || '';
    formData.append('roadway_name', roadwayName);
    this.project_form.controls.from.value ? formData.append('from', this.project_form.controls.from.value as string) : null;
    this.project_form.controls.to.value ? formData.append('to', this.project_form.controls.to.value as string) : null;
    this.project_form.controls.city.value ? formData.append('city', this.project_form.controls.city.value as string) : null;
    this.project_form.controls.parish.value ? formData.append('parish', this.project_form.controls.parish.value as string) : null;
    this.project_form.controls.control_section.value ? formData.append('control_section', this.project_form.controls.control_section.value as string) : null;
    this.project_form.controls.begin_mile.value ? formData.append('begin_mile', this.project_form.controls.begin_mile.value as string) : null;
    this.project_form.controls.end_mile.value ? formData.append('end_mile', this.project_form.controls.end_mile.value as string) : null;
    this.project_form.controls.description.value ? formData.append('description', this.project_form.controls.description.value as string) : null;
    this.project_form.controls.location.value ? formData.append('location', this.project_form.controls.location.value as string) : null;
    this.project_form.controls.latitude.value ? formData.append('latitude', this.project_form.controls.latitude.value as string) : null;
    this.project_form.controls.longitude.value ? formData.append('longitude', this.project_form.controls.longitude.value as string) : null;
    this.project_form.controls.coords.value ? formData.append('coords', JSON.stringify(this.project_form.controls.coords.value)) : null;
    this.project_form.controls.roadway_area_type.value ? formData.append('roadway_area_type', JSON.stringify(this.project_form.controls.roadway_area_type.value)) : null;
    this.project_form.controls.roadway_classification.value ? formData.append('roadway_classification', JSON.stringify(this.project_form.controls.roadway_classification.value)) : null;
    this.project_form.controls.focus_area.value ? formData.append('focus_area', JSON.stringify(this.project_form.controls.focus_area.value)) : null;
    this.project_form.controls.average_annual_day_traffic_vehicular_volume.value ? formData.append('average_annual_day_traffic_vehicular_volume', JSON.stringify(this.project_form.controls.average_annual_day_traffic_vehicular_volume.value)) : null;
    this.project_form.controls.problems_to_be_addressed.value ? formData.append('problems_to_be_addressed', JSON.stringify(this.project_form.controls.problems_to_be_addressed.value)) : null;
    this.project_form.controls.crash_types_being_targeted.value ? formData.append('crash_types_being_targeted', JSON.stringify(this.project_form.controls.crash_types_being_targeted.value)) : null;
    this.project_form.controls.countermeasures.value ? formData.append('countermeasures', JSON.stringify(this.project_form.controls.countermeasures.value)) : null;
    this.project_form.controls.total_project_cost.value ? formData.append('total_project_cost', this.project_form.controls.total_project_cost.value as unknown as string) : null;
    this.project_form.controls.total_savings_in_crash_reduction.value ? formData.append('total_savings_in_crash_reduction', this.project_form.controls.total_savings_in_crash_reduction.value as string) : null;
    this.project_form.controls.benefit_cost_ratio.value ? formData.append('benefit_cost_ratio', this.project_form.controls.benefit_cost_ratio.value as string) : null;
    this.project_form.controls.notes.value ? formData.append('notes', this.project_form.controls.notes.value as string) : null;
    this.project_form.controls.added_by.value ? formData.append('added_by', this.project_form.controls.added_by.value as string) : null;
    this.project_form.controls.department.value ? formData.append('department', this.project_form.controls.department.value as string) : null;
    this.project_form.controls.is_published.value ? formData.append('is_published', this.project_form.controls.is_published.value as unknown as string) : null;
    this.project_form.controls.last_edited_by.value ? formData.append('last_edited_by', this.project_form.controls.last_edited_by.value as string) : null;

    return formData;

  }

  cancelClicked() {
    this.router.navigate(['/dashboard']);
  }

  downloadPDFClicked() {
    window.open(this.data?.uploaded_document, '_blank');
  }

  uploadPDFClicked() {
    this.fileInput?.nativeElement.click();
  }

  deleteDocumentClicked() {
    // update uploaded_file_deleted to true
    this.uploaded_file_deleted = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
