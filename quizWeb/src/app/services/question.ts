import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OptionDto {
  id?: number;
  optionText: string;
  isCorrect: boolean;
}

export interface QuestionDto {
  id?: number;
  questionText: string;
  testId: number;
  options: OptionDto[];
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private baseUrl = 'http://localhost:8080/api/admin/questions';

  constructor(private http: HttpClient) {}

  addQuestion(questionDto: QuestionDto): Observable<QuestionDto> {
    return this.http.post<QuestionDto>(this.baseUrl, questionDto);
  }
}