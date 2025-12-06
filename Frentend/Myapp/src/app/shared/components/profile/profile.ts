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
    name: 'Simo 6 ',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQixhzI7xr1ouPUT_f7BIIS8ErIWs3Vx8FiZA&s',
    bio: ' tikxbila twliwla ',
    
    stats: {
      posts: 12,
      followers: '0',
      following: 340
    }
  };

  posts: Post[] = [
    {
      id: 'p1',
      authorName: 'Simo 6',
      authorAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQixhzI7xr1ouPUT_f7BIIS8ErIWs3Vx8FiZA&s',
      bio : 'Tech enthusiast & UI designer. Sharing my journey.',
      content: 'ghandiro haja jdida had l3am 2030, stay tuned! #excited #newbeginnings',
      date: new Date(new Date().getTime() - (1000 * 60 * 30)), // 30 mins ago
      likes: 45,
      comments: 12
    },
    {
      id: 'p2',
      authorName: 'Simo 6',
      authorAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQixhzI7xr1ouPUT_f7BIIS8ErIWs3Vx8FiZA&s',
      bio : 'Tech enthusiast & UI designer. Sharing my journey.',
      content: 'ikone khire l3am jay inshallah (20??)! #motivation #goals',
      date: new Date(new Date().getTime() - (1000 * 60 * 30)), // 30 mins ago
      likes: 45,
      comments: 12
    }
  ];
}