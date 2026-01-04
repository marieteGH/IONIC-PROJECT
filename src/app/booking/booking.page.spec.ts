import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingPage } from './booking.page'; // <-- Corregido

describe('BookingPage', () => { // <-- Corregido
  let component: BookingPage; // <-- Corregido
  let fixture: ComponentFixture<BookingPage>; // <-- Corregido

  beforeEach(async () => {
    fixture = TestBed.createComponent(BookingPage); // <-- Corregido
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});