import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Itrainers } from '../../models/itrainers';

@Injectable({
  providedIn: 'root',
})
export class TrainersService {
  token = localStorage.getItem('userToken');
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      token: `${this.token}`,
    }),
  };
  constructor(private http: HttpClient) {}
  addTrainer(trainerData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:5000/coach/add', trainerData, {
      headers: new HttpHeaders({
        token: `${this.token}`,
      }),
    });
  }

  getTrainers(): Observable<any> {
    return this.http.get<any>('http://localhost:5000/coaches', this.httpOptions);
  }
  getTrainersPaginated(page: number): Observable<any> {
    return this.http.get<any>(
      `http://localhost:5000/coach?page=${page}`,
      this.httpOptions
    );
  }

  getTrainer(id: string): Observable<any> {
    return this.http
      .get<any>(`http://localhost:5000/coach/${id}`, this.httpOptions)
      .pipe(map((response: any) => response.coach));
  }

  editTrainer(id: string, data: any): Observable<any> {
    console.log(id + 'id');
    console.log(data);
    return this.http.put<any>(
      `http://localhost:5000/coach/update/${id}`,
      data,
      {
        headers: new HttpHeaders({
          token: `${this.token}`,
        }),
      }
    );
  }

  deleteTrainer(id: string): Observable<any> {
    return this.http.delete(`http://localhost:5000/coach/${id}`, {
      headers: new HttpHeaders({
        token: `${this.token}`,
      }),
    });
  }
}
