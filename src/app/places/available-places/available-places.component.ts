import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

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

  constructor(private placesService: PlacesService, private destroyRef: DestroyRef) {}

  ngOnInit() {
    this.isFetching.set(true);

    const subscription = 
    this.placesService.loadAvailablePlaces()
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

  onSelectPlace(selectedPlace: Place) {
    const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace)
    .subscribe((r) => console.log(r));

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
