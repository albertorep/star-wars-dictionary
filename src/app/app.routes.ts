import { Routes } from '@angular/router';
import { CollectionComponent } from './collection/collection.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', component: HomeComponent },
    {
        path: ':tabId',
        component: CollectionComponent
    },
];