import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatResponseDisplayComponent } from './chat-response-display.component';

describe('ChatResponseDisplayComponent', () => {
  let component: ChatResponseDisplayComponent;
  let fixture: ComponentFixture<ChatResponseDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatResponseDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatResponseDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
