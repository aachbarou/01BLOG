import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Post } from '../../../core/models/post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.html',
  styleUrls: ['./post.css']
})
export class PostComponent implements OnChanges {
  @Input({ required: true }) post!: Post;
  isLiked: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['post'] && this.post) {
      this.post.mediaUrl = this.getMediaUrl(this.post.mediaUrl);
    }
  }

  getMediaUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080/files/${url}`;
  }
}
