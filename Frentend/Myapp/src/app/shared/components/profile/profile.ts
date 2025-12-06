import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../post/post';

// Define models for the simulation
export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  stats: {
    posts: number;
    followers: string;
    following: number;
  };
}

export interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  date: Date;
  likes: number;
  comments: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PostComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent {
  profile: UserProfile = {
    id: 'u1',
    name: 'Sarah Tech',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah', 
    bio: 'Tech enthusiast & UI designer. Sharing my journey.',
    stats: {
      posts: 12,
      followers: '1.2k',
      following: 340
    }
  };

  posts: Post[] = [
    {
      id: 'p1',
      authorName: 'Sarah Tech',
      authorAvatar: 'https://i.pravatar.cc/150?u=sarah',
      content: 'Just finished the new Angular tutorial. Signals are a game changer for reactivity! #webdev #angular',
      date: new Date(new Date().getTime() - (1000 * 60 * 30)), // 30 mins ago
      likes: 45,
      comments: 12
    },
    {
      id: 'p2',
      authorName: 'Sarah Tech',
      authorAvatar: 'https://i.pravatar.cc/150?u=sarah',
      content: 'Just finished the new Angular tutorial. Signals are a game changer for reactivity! #webdev #angular',
      date: new Date(new Date().getTime() - (1000 * 60 * 30)), // 30 mins ago
      likes: 45,
      comments: 12
    }
  ];
}