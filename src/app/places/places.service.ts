import { Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private backendAddress = 'http://localhost:3000/';
  
  loadedUserPlaces = this.userPlaces.asReadonly();

  constructor(private httpClient: HttpClient) {}

  loadAvailablePlaces() {
    return this.fetchPlaces('places', 
      'Something went wrong fetching the available places. Please try again later.');
  }

  loadUserPlaces() {
    return this.fetchPlaces('user-places',
      'Something went wrong fetching your favourite places. Please try again later.')
      .pipe(
        tap((userPlaces) => this.userPlaces.set(userPlaces))
      );
  }

  addPlaceToUserPlaces(place: Place) {
    const oldPlaces = this.userPlaces();

    if (!oldPlaces.some((p) => p.id === place.id)) {
      this.userPlaces.set([...oldPlaces, place]);
    }

    return this.httpClient.put(this.backendAddress + 'user-places', {placeId: place.id})
    .pipe(
      catchError(e => {
        console.error(e);
        this.userPlaces.set(oldPlaces);

        return throwError(() => new Error('Failed to store selected place.'));
      })
    );
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(path: string, errorMessage: string) {
    return this.httpClient
    .get<{ places: Place[] }>(this.backendAddress + path)
    .pipe(
      map((r) => r.places),
      catchError((e) => {
        console.error(e);

        return throwError(() => new Error(errorMessage))
      })
    )
  }
}
