import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { Post } from '../../core/models/post.model';
import { PostComponent } from '../../shared/components/post/post';

@Component({
    selector: 'app-post-view',
    standalone: true,
    imports: [CommonModule, PostComponent],
    templateUrl: './post-view.html',
    styleUrl: './post-view.css'
})
export class PostViewComponent implements OnInit {
    post: Post | null = null;
    isLoading = true;
    errorType: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private postService: PostService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id');
        const postId = Number(idParam);

        if (!idParam || isNaN(postId)) {
            this.router.navigate(['/error'], { queryParams: { type: '404' } });
            return;
        }

        this.postService.getPostById(postId).subscribe({
            next: (response) => {
                this.post = response.data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.isLoading = false;
                if (err.status === 403) {
                    this.errorType = '403';
                } else if (err.status === 404) {
                    this.errorType = '404';
                } else if (err.status === 401) {
                    this.router.navigate(['/login']);
                    return;
                } else {
                    this.errorType = '500';
                }
                this.cdr.detectChanges();
            }
        });
    }

    goHome() {
        this.router.navigate(['/home']);
    }
}
