import { Component  , Input} from '@angular/core';
import { Post } from '../../../core/models/post.model';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class PostComponent {
  @Input({ required: true }) post!: Post;
   isLiked : boolean  =  false  ;
   toggleLike()  : void  {
      this.isLiked  =  !this.isLiked  ;
        this.post.likes += this.isLiked  ?  1  :  -1  ;
  }
          
  }
