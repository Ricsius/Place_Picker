import { Component } from '@angular/core';
import { ErrorModalComponent } from './shared/modal/error-modal/error-modal.component';
import { AvailablePlacesComponent } from './places/available-places/available-places.component';
import { UserPlacesComponent } from './places/user-places/user-places.component';
import { ErrorService } from './shared/error.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    AvailablePlacesComponent, 
    UserPlacesComponent,
    ErrorModalComponent
  ],
})
export class AppComponent {
  error = this.errorService.error;

  constructor(private errorService: ErrorService) {}
}
