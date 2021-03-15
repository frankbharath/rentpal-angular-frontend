import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[MatDialogModule],
      declarations: [ ConfirmDialogComponent ],
      providers:[
        {provide:MatDialogRef, useValue:mockDialogRef}, 
        {provide:MAT_DIALOG_DATA , useValue:{title:"Title", message:"Message"}}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create confirm dialog component', () => {
    expect(component).toBeTruthy();
  });

  it('confirm dialog component title should be "Title"', ()=>{
    expect(component.title).toBe("Title");
  })

  it('confirm dialog component message should be "Message"', ()=>{
    expect(component.message).toBe("Message");
  })

  it('confirm dialog should close with "true" while performing confirm operation', () => {
    component.onConfirm();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('confirm dialog should close with "false" while performing cancel operation', () => {
    component.onDismiss();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

});
