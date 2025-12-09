import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMascotaPage } from './add-mascota.page';

describe('AddMascotaPage', () => {
  let component: AddMascotaPage;
  let fixture: ComponentFixture<AddMascotaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMascotaPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AddMascotaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
