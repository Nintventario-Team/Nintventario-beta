import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  alertTopic = ''
  alertMessage = ''
  alertType: 'verify' | 'error' | 'confirm' = 'verify'
  showAlert = false

  setAlert(topic: string, message: string, type: 'verify' | 'error' | 'confirm') {
    this.alertTopic = topic
    this.alertMessage = message
    this.alertType = type
    this.showAlert = true
  }

  clearAlert() {
    this.showAlert = false
  }
}
