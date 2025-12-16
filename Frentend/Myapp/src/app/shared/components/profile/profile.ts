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

  posts: Post[] = [
    {
      id: 'p1',
      authorName: 'mohmad sta',
      authorAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQixhzI7xr1ouPUT_f7BIIS8ErIWs3Vx8FiZA&s',
      bio : 'Tech enthusiast & UI designer. Sharing my journey.',
      content: 'Mhm rana Khdamin ... ghandiro haja jdida had l3am 2030, stay tuned! #excited #newbeginnings',
      imageUrl : 'https://www.moroccoworldnews.com/wp-content/uploads/2025/12/Safi-Floods-UAE-Extends-Condolences-Solidarity-with-Morocco.jpeg',
      date: new Date(new Date().getTime() - (1000 * 60 * 30)), 
      likes: 4905,
      comments: 12
    },
    {
      id: 'p2',
      authorName: 'mohmad sta',
      authorAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQixhzI7xr1ouPUT_f7BIIS8ErIWs3Vx8FiZA&s',
      bio : 'Tech enthusiast & UI designer. Sharing my journey.',
      content: 'Sidhom Oghre9 ax ndir  ana hhhh Ikone khire ! #motivation #goals',
      imageUrl : 'https://dims.apnews.com/dims4/default/fde0594/2147483647/strip/true/crop/4735x3157+0+0/resize/599x399!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F7c%2F40%2Ffa3f6cc3bd8b93d1a7e18146b526%2F05f9c4e1ba274b8c96b075ee73762c15',
      date: new Date(new Date().getTime() - (1000 * 60 * 30)), 
      likes: 703,
      comments: 12
    }
  ];
}