import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Resource } from '../interfaces/resource.interface';
import { StarWarsService } from '../services/swapi-data.service';

@Injectable({ providedIn: 'root' })
export class CollectionResolver implements Resolve<{ resources: Resource[], count: number }> {
  constructor(private swService: StarWarsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<{ resources: Resource[], count: number }> {
    const category = route.paramMap.get('tabId') || 'people';
    return this.swService.getResources(category, 1);
  }
}
