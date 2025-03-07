import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common'; // Angular 19 common directives
import { FormsModule } from '@angular/forms';
import { ContactService, Contact } from '../../services/contact.service';

@Component({
  selector: 'app-address-book',
  standalone: true, // Standalone component
  imports: [NgFor, NgIf, FormsModule], // Import Angular directives
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss'],
})
export class AddressBookComponent implements OnInit {
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.fetchContacts();
  }

  fetchContacts(): void {
    this.contactService.getContacts().subscribe({
      next: (data) => {
        console.log("Fetched contacts:", data);
        this.contacts = data;
      },
      error: (error) => {
        console.error('Error fetching contacts:', error);
        alert('Failed to load contacts! Check API connection.');
      },
    });
  }

  onEdit(contact: Contact): void {
    this.selectedContact = { ...contact };
  }

  onDelete(id: number): void {
    if (!id) {
      console.error('Invalid contact ID');
      return;
    }

    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(id).subscribe(() => {
        this.contacts = this.contacts.filter((contact) => contact.id !== id);
        console.log(`Deleted contact with ID: ${id}`);
      });
    }
  }

  onSave(): void {
    if (!this.selectedContact) {
      console.error("No contact selected!");
      return;
    }

    console.log("Save button clicked!", this.selectedContact);

    if (!this.selectedContact.id || this.selectedContact.id === 0) {
      // Adding a new contact
      this.contactService.addContact(this.selectedContact).subscribe({
        next: (newContact) => {
          console.log("New contact added:", newContact);
          this.contacts.push(newContact);
          this.selectedContact = null;
        },
        error: (error) => {
          console.error("Error adding contact:", error);
        }
      });
    } else {
      // Updating existing contact
      this.contactService.updateContact(this.selectedContact.id, this.selectedContact).subscribe({
        next: (updatedContact) => {
          console.log("Updated contact:", updatedContact);
          const index = this.contacts.findIndex(c => c.id === updatedContact.id);
          if (index !== -1) {
            this.contacts[index] = updatedContact;
          }
          this.selectedContact = null;
        },
        error: (error) => console.error("Error updating contact:", error),
      });
    }
  }

  onAdd(): void {
    console.log("Add Person button clicked!");

    this.selectedContact = {
      id: 0, // Use 0 for new contacts
      fullname: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    };
  }

  onCancelEdit(): void {
    this.selectedContact = null;
  }
}
