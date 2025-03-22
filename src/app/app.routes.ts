import { Routes } from '@angular/router';
import { CollectionComponent } from './collection/collection.component';

export const routes: Routes = [
    {
        path: ':tabId',
        component: CollectionComponent
    },
    {
        path: '',
        redirectTo: 'collection',
        pathMatch: 'full'
    }
];