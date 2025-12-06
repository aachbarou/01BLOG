import {Post} from '../models/post.model';
export function fetchPosts ():Post[]  {
     let  posts: Post[] = [
    {
      id: '1',
      authorName: 'Sarah Tech',
      authorAvatar: 'https://i.pravatar.cc/150?u=sarah',
      content: 'Just started learning Angular 18. The new control flow syntax is amazing! 🚀',
      date: new Date(),
      likes: 45,
      comments: 12
    },
    {
      id: '2',
      authorName: 'Alex Design',
      authorAvatar: 'https://i.pravatar.cc/150?u=jhon',
      content: 'Working on a new Glassmorphism UI kit. What do you think about these colors?',
      imageUrl: 'https://picsum.photos/600/300',
      date: new Date(Date.now() - 3600000), 
      likes: 120,
      comments: 34
    }
  ];
  return posts;
}