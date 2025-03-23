import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Resource, ResourceType } from '../interfaces/resource.interface';
import { adaptResource } from '../adapters/resource.adapter';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StarWarsService {
  private baseUrl = 'https://swapi.dev/api/';
  private tabsLoadingSubject = new BehaviorSubject<boolean>(true);
  tabsLoading$ = this.tabsLoadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCategories(): Observable<{ name: string; path: string }[]> {
    this.tabsLoadingSubject.next(true); // signal loading started
  
    return this.http.get<{ [key: string]: string }>(this.baseUrl).pipe(
      map(response =>
        Object.entries(response).map(([key, url]) => ({
          name: this.formatCategoryName(key),
          path: key
        }))
      ),
      tap(() => this.tabsLoadingSubject.next(false)),
      catchError(error => {
        console.error('Error loading categories:', error);
        this.tabsLoadingSubject.next(false);
        return of([]); // fallback
      })
    );
  }
  

  getResources(category: string, page = 1): Observable<{ resources: Resource[]; count: number }> {
    return this.http.get<any>(`${this.baseUrl}${category}/?page=${page}`).pipe(
      map(response => {
        const resources = response.results.map((item: any) =>
          adaptResource(item, category as ResourceType)
        );
        return {
          resources,
          count: response.count
        };
      }),
      catchError(error => {
        console.error(`Error fetching resources for ${category} page ${page}:`, error);
        return of({ resources: [], count: 0 }); // fallback
      })
    );
  }

  private formatCategoryName(key: string): string {
    return key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
  }
}
