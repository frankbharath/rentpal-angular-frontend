import { TrimDirective } from './trim.directive';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template:`<input appTrim/>`
})

class TestComponent{}

describe('TrimDirective', () => {
  let component:TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElement:DebugElement;

  beforeEach(()=>{
    fixture=TestBed.configureTestingModule({declarations:[TrimDirective, TestComponent]})
    .createComponent(TestComponent);
    component=fixture.componentInstance;
    inputElement=fixture.debugElement.query(By.directive(TrimDirective));
  });

  it('trim input value if it contains whitespace', () => {
    const event = new Event('change');
    inputElement.nativeElement.value = ' value ';
    inputElement.nativeElement.dispatchEvent(event);
    expect(inputElement.nativeElement.value).toBe('value');
  });
});
