import { Component, OnInit, Input } from '@angular/core';
import { StatusMessageService } from 'src/app/status-message.service';
import { MessageStatus } from './messageStatus';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-status-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  messageStatus$: Observable<MessageStatus>;

  @Input() Module?: string;

  constructor(private statusMessageService: StatusMessageService) { 
    this.messageStatus$ = statusMessageService.GetStatusSubject(this.Module);
  }

  ngOnInit() {}

  onClose(){
    this.statusMessageService.ClearMessage();
  }

}
