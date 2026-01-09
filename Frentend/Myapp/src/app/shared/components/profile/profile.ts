import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../post/post';
import  { Post } from '../../../core/models/post.model';
import { UserProfile } from '../../../core/models/user.model';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PostComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export  class ProfileComponent {
   @Input({required: true}) profile!: UserProfile;
   // there  i can add the  logic  of the  posts  and  profile 
   @Input({required: true}) posts!: Post[]; 
}