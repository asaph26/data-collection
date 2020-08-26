import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    errorMessage: string;
    loading: boolean = true;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private as: AuthService
    ) {}

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(5)]],
        });
        this.as.loginState.subscribe((val) => {
            console.log(val);
            if (val === 'AUTH_INITIATED') {
                this.loading = true;
            }
            if (val === 'AUTH_SIGNED_IN') {
                this.navigateToHome();
            }
            if (val === 'AUTH_SIGNED_OUT') {
                this.loading = false;
            }
        });
    }

    login() {
        const lfv = this.loginForm.value;
        this.as
            .login(lfv.email, lfv.password)
            .then(() => this.navigateToHome())
            .catch((err) => {
                this.errorMessage = err.message;
                this.loginForm.reset();
            });
    }

    navigateToHome() {
        this.router.navigate(['']);
    }
}

/**
 * 1. When a user is logged in, he should be directly taken to the home screen otherwise to the login screen
 * 2. If the user goes to the login screen, after he has logged in, he should still be redirected without doing anything
 * 3. When a user logsout they should not be able to go to any other screen and should only go to the home screen
 */
