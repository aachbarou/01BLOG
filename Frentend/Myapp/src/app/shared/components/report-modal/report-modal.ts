import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-modal.html',
  styleUrl: './report-modal.css'
})
export class ReportModalComponent {
  @Input() type!: 'user' | 'post';
  @Input() targetId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  reasons: string[] = [
    'Spam or misleading',
    'Inappropriate content',
    'Harassment or bullying',
    'Hate speech',
    'Other'
  ];

  selectedReason: string = '';
  otherReasonText: string = '';
  isSubmitting = false;

  constructor(private userService: UserService) { }

  selectReason(reason: string) {
    this.selectedReason = reason;
    if (reason !== 'Other') {
      this.otherReasonText = '';
    }
  }

  submitReport() {
    if (!this.selectedReason) return;

    const finalReason = this.selectedReason === 'Other'
      ? this.otherReasonText.trim() || 'Other'
      : this.selectedReason;

    this.isSubmitting = true;

    this.userService.report(this.type, this.targetId, finalReason).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitted.emit();
        this.close.emit();
      },
      error: (err: any) => {
        console.error('Failed to submit report', err);
        this.isSubmitting = false;
        alert('Failed to submit report. Please try again later.');
      }
    });
  }

  closeModal() {
    this.close.emit();
  }
}
