import { Component, DestroyRef, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { map, catchError, throwError } from 'rxjs';
import { Place } from '../place.model';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private backendAddress = 'http://localhost:3000/';
  
  constructor(private httpClient: HttpClient, private destroyRef: DestroyRef) {}

  ngOnInit() {
      this.isFetching.set(true);
  
      const subscription = this.httpClient.get<{ places: Place[] }>(this.backendAddress + 'user-places')
      .pipe(
        map((r) => r.places),
        catchError((e) => {
          console.error(e);
  
          return throwError(() => new Error('Something went wrong fetching your favourite places. Please try again later.'))
        })
      )
      .subscribe({
        next: (response) => {
          this.places.set(response);
        },
        complete: () => {
          this.isFetching.set(false);
        },
        error: (e: Error) => {
          this.error.set(e.message);
        }
      });
  
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
}

