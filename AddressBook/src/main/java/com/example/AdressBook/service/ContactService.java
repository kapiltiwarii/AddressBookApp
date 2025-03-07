package com.example.AdressBook.service;

import com.example.AdressBook.model.Contact;
import com.example.AdressBook.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ContactService {
    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Optional<Contact> getContactById(Long id) {
        return contactRepository.findById(id);
    }
@Transactional
public Contact addContact(Contact contact) {
    contact.setId(null); // Force Hibernate to treat it as a new entity
    contact.setVersion(0); // Ensure version starts correctly
    return contactRepository.save(contact);
}
@Transactional
    public Contact updateContact(Long id, Contact contact) {
        return contactRepository.findById(id)
                .map(existingContact -> {
                    existingContact.setFullname(contact.getFullname());
                    existingContact.setPhoneNumber(contact.getPhoneNumber());
                    existingContact.setAddress(contact.getAddress());
                    existingContact.setCity(contact.getCity());
                    existingContact.setState(contact.getState());
                    existingContact.setZipCode(contact.getZipCode());
                    return contactRepository.save(existingContact);
                }).orElseThrow(() -> new RuntimeException("Contact not found with id " + id));
    }
@Transactional
    public void deleteContact(Long id) {
        if (contactRepository.existsById(id)) {
            contactRepository.deleteById(id);
        } else {
            throw new RuntimeException("Contact not found with id " + id);
        }
    }
}
