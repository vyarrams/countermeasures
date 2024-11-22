import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      const url = event.url;
      if (event instanceof NavigationEnd) {
        // Router navigation successful
        this.activatedRoute.queryParams.subscribe(params => {
          if (params['ref']) {
            const ref = params['ref'];
            const data = {
              ref: ref,
              route: url
            };
          }
        });
      }
    });
  }
}
