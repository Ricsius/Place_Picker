import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private backendAddress = 'http://localhost:3000/';

  constructor(private httpClient: HttpClient, private destroyRef: DestroyRef) {}

  ngOnInit() {
    this.isFetching.set(true);

    const subscription = this.httpClient.get<{ places: Place[] }>(this.backendAddress + 'places')
    .pipe(
      map((r) => r.places),
      catchError((e) => {
        console.error(e);

        return throwError(() => new Error('Something went wrong fetching the available places. Please try again later.'))
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
