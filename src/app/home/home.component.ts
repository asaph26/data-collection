import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
    user;
    sub: Subscription;
    loading: boolean = true;
    constructor(private as: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.sub = this.as.currentUser.subscribe((val) => {
            console.log('The Home Component has received the user');
            this.user = val;
        });
        this.as.loginState.subscribe((val) => {
            console.log(val);
            if (val === 'AUTH_INITIATED') {
                this.loading = true;
            }
            if (val === 'AUTH_SIGNED_IN') {
                this.loading = false;
            }
            if (val === 'AUTH_SIGNED_OUT') {
                this.navigateToLogin();
            }
        });
    }

    logout() {
        this.as.logout();
        this.navigateToLogin();
    }

    navigateToLogin() {
        this.router.navigate(['login']);
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
