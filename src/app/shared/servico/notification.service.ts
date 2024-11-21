import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications: Message[] = [];

  getMessages(): Message[] {
    return this.notifications;
  }

  addMessage(message: Message): void {
    this.notifications.push(message);
  }

  clearMessages(): void {
    this.notifications = [];
  }
}
