import { Component } from '@angular/core';
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
  profile: UserProfile = {
    id: 'u1',
    name: 'Mo7  ',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQixhzI7xr1ouPUT_f7BIIS8ErIWs3Vx8FiZA&s',
    bio: ' tikxbila twliwla ',
    
    stats: {
      posts: 2,
      followers: '0',
      following: 4
    }
  };

 
}