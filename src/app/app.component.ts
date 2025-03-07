import { Component } from '@angular/core';
import { AddressBookComponent } from './components/address-book/address-book.component';

@Component({
  selector: 'app-root',
  standalone: true, // Standalone mode in Angular 19+
  imports: [AddressBookComponent], // Import your AddressBookComponent
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Address Book';
}
