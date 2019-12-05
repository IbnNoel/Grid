import { Component, OnInit } from '@angular/core';
import { StatusMessageService } from 'src/app/status-message.service';
import { MessageStatus } from './messageStatus';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-status-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  private messageStatus$: Observable<MessageStatus>;

  constructor(private statusMessageService: StatusMessageService) { 
    this.messageStatus$ = statusMessageService.StatusSubject;
  }

  ngOnInit() {}

  onClose(){
    this.statusMessageService.ClearMessage();
  }

}
