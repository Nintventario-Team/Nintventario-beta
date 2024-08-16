/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent implements OnInit {
  @Input() showAlert: boolean = false
  @Input() alertTopic: string = ''
  @Input() alertMessage: string = ''
  @Input() alertType: 'verify' | 'error' | 'confirm' = 'verify'

  @Output() confirmAction = new EventEmitter<boolean>()

  progressWidth = 100
  alertTimeout: any
  progressInterval: any

  get iconUrl(): string {
    switch (this.alertType) {
      case 'error':
        return 'https://firebasestorage.googleapis.com/v0/b/nintventario.appspot.com/o/img%2Fexclamation-circle-fill.svg?alt=media&token=004acf29-80fb-4eb3-80ac-0d111e591ca1'
      case 'confirm':
        return 'https://firebasestorage.googleapis.com/v0/b/nintventario.appspot.com/o/img%2Fquestion-circle-fill.svg?alt=media&token=a5cfcb19-cf05-416e-b190-0bbf5f7f2be8'
      default:
        return 'https://firebasestorage.googleapis.com/v0/b/nintventario.appspot.com/o/img%2Fcheck-circle-fill.svg?alt=media&token=b454a968-3c79-462f-8da9-d63ff603733f'
    }
  }

  ngOnInit(): void {
    if (this.alertType !== 'confirm') {
      this.startAlertTimer()
    }
  }

  resetAlert(): void {
    this.closeAlert()
    this.showAlert = true
    this.progressWidth = 100
    if (this.alertType !== 'confirm') {
      this.startAlertTimer()
    }
  }

  startAlertTimer(): void {
    const totalDuration = 7000
    const intervalDuration = 100
    const decrementAmount = (intervalDuration / totalDuration) * 100

    this.progressInterval = setInterval(() => {
      this.progressWidth -= decrementAmount
      if (this.progressWidth <= 0) {
        this.closeAlert()
      }
    }, intervalDuration)

    this.alertTimeout = setTimeout(() => {
      this.closeAlert()
    }, totalDuration)
  }

  closeAlert(): void {
    this.showAlert = false
    clearTimeout(this.alertTimeout)
    clearInterval(this.progressInterval)
    this.progressWidth = 100
  }

  confirm(accepted: boolean): void {
    this.closeAlert()
    this.confirmAction.emit(accepted)
  }
}