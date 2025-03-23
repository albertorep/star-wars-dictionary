import { Routes } from '@angular/router';
import { CollectionComponent } from './collection/collection.component';
import { HomeComponent } from './home/home.component';
import { CollectionResolver } from './resolvers/collection.resolver';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', component: HomeComponent },
    {
        path: ':tabId',
        component: CollectionComponent,
        resolve: {
          resources: CollectionResolver
        }
    },
];