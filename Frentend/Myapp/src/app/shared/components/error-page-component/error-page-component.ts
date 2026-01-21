import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-page-component.html',
  styleUrl: './error-page-component.css'
})
export class ErrorPageComponent implements OnInit {
  errorConfig = {
    code: '404',
    title: 'System Drift',
    message: "Something went wrong on our end or the page has vanished into the digital void. Don't worry, we can get you back."
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['type'] === 'generic') {
        this.errorConfig = {
          code: '500',
          title: 'Internal Glitch',
          message: 'Our servers are experiencing some turbulence. We are working to stabilize the frequency.'
        };
      }
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}