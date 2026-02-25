import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  imports: [],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyStateComponent {
  @Input() title: string = 'No posts yet';
  @Input() message: string = 'Be the first to share your thoughts with the community.';
  @Input() showButton: boolean = true;
  @Input() buttonText: string = 'Create Post';

  @Output() actionClicked = new EventEmitter<void>();
}
