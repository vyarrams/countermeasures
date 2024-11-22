import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${environment.api}get-user-by-id/${id}`, { observe: 'body' });
  }
  // Get users by ids
  getUsersByIds(data: any): Observable<any> {
    return this.http.post(`${environment.api}get-users-by-ids`, data, { observe: 'body' });
  }
  // Get user by username
  getUserByUsername(username: string): Observable<any> {
    return this.http.get(`${environment.api}get-user-by-username/${username}`, { observe: 'body' });
  }
  // create-pro-checkout-session
  createProCheckoutSession(data: any): Observable<any> {
    return this.http.post(`${environment.api}create-pro-checkout-session`, data, { observe: 'body' });
  }


  // get-all-users
  getAllUsers(): Observable<any> {
    return this.http.get(`${environment.api}get-all-users`, { observe: 'body' });
  }

  getAllProjects(): Observable<any> {
    return this.http.get(`${environment.api}get-all-projects`, { observe: 'body' });
  }

  // add-project
  addProject(data: any): Observable<any> {
    return this.http.post(`${environment.api}add-project`, data, { observe: 'body' });
  }

  // /upload-project-document/:id
  uploadProjectDocument(id: string, data: any): Observable<any> {
    return this.http.post(`${environment.api}upload-project-document/${id}`, data, { observe: 'body' });
  }

  // delete-uploaded-document/:id
  deleteUploadedDocument(id: string): Observable<any> {
    return this.http.delete(`${environment.api}delete-uploaded-document/${id}`, { observe: 'body' });
  }

  updateProject(id: string, data: any): Observable<any> {
    return this.http.put(`${environment.api}update-project/${id}`, data, { observe: 'body' });
  }

  // delete-project/:id
  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${environment.api}delete-project/${id}`, { observe: 'body' });
  }

  // /get-all-filter-data
  getAllFilterData(): Observable<any> {
    return this.http.get(`${environment.api}get-all-filter-data`, { observe: 'body' });
  }

  getProject(id: string): Observable<any> {
    return this.http.get(`${environment.api}get-project/${id}`, { observe: 'body' });
  }

  downloadProjectPdf(id: string) {
    window.open(`${environment.api}download-project-pdf/${id}`, '_blank');
  }

  // getAgentProjects
  getAgentProjects(id: string): Observable<any> {
    return this.http.get(`${environment.api}get-agent-projects/${id}`, { observe: 'body' });
  }

  // getViewOnlyProjects
  getViewOnlyProjects(id: string): Observable<any> {
    return this.http.get(`${environment.api}get-view-only-projects/${id}`, { observe: 'body' });
  }

  // update-user
  updateUser(data: any): Observable<any> {
    return this.http.post(`${environment.api}update-user`, data, { observe: 'body' });
  }

  // add-department
  addDepartment(data: any): Observable<any> {
    return this.http.post(`${environment.api}add-department`, data, { observe: 'body' });
  }

  // get-all-departments
  getAllDepartments(): Observable<any> {
    return this.http.get(`${environment.api}get-all-departments`, { observe: 'body' });
  }

  // update-department/:id
  updateDepartment(id: string, data: any): Observable<any> {
    return this.http.put(`${environment.api}update-department/${id}`, data, { observe: 'body' });
  }

  // delete-department/:id
  deleteDepartment(id: string): Observable<any> {
    return this.http.delete(`${environment.api}delete-department/${id}`, { observe: 'body' });
  }

  // assignUserToDepartment
  assignUserToDepartment(data: any): Observable<any> {
    return this.http.post(`${environment.api}assign-user-to-department`, data, { observe: 'body' });
  }

  // temp-update-data
  tempUpdateData(data: any): Observable<any> {
    return this.http.post(`${environment.api}temp-update-data`, data, { observe: 'body' });
  }

}
