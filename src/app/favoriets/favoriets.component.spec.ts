import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorietsComponent } from './favoriets.component';

describe('FavorietsComponent', () => {
  let component: FavorietsComponent;
  let fixture: ComponentFixture<FavorietsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavorietsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavorietsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
