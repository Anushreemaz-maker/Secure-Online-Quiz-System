import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TestDto {
  id?: number;
  title: string;
  description: string;
  timeLimit: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private BASE_URL = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  createTest(testdto: any): Observable<TestDto> {
    return this.http.post<TestDto>(`${this.BASE_URL}/tests`, testdto);
  }

  getAllTests(): Observable<TestDto[]> {   // ← ADD
    return this.http.get<TestDto[]>(`${this.BASE_URL}/tests`);
  }
}