import { Component, DestroyRef, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  places = this.placesService.loadedUserPlaces;
  isFetching = signal(false);
  error = signal('');
  
  constructor(private placesService: PlacesService, private destroyRef: DestroyRef) {}

  ngOnInit() {
      this.isFetching.set(true);
  
      const subscription = this.placesService.loadUserPlaces()
      .subscribe({
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

    onRemovePlace(place: Place) {
      const subscription = this.placesService.removeUserPlace(place)
      .subscribe();

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
}

