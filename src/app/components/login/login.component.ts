import { Component, ElementRef, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FirebaseStorageService } from '../../services/firebase-storage.service';
import { LogInterface } from '../../interface/log.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  toastAlert = inject(ToastrService);
  fb = inject(FormBuilder);
  authService = inject(FirebaseAuthService);
  router = inject(Router);
  elementRef = inject(ElementRef);
  storage = inject(FirebaseStorageService);

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    const value = this.form.getRawValue();
    this.authService.login(value.email, value.password).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
        let log: LogInterface = {
          email: value.email,
          date: new Date(),
        };
        this.storage.saveAll(log);
      },
      error: () => {
        this.toastAlert.error('Email o Password incorrect', 'Login Error');
      },
    });
  }

  userA() {
    this.form.setValue({ email: 'kopop74796@idsho.com', password: 'asd123' });
  }
  userB() {
    this.form.setValue({ email: 'palmiharze@gufum.com', password: 'asd123' });
  }
  userC() {
    this.form.setValue({
      email: 'jeniffer93408@wlks.crankymonkey.info',
      password: 'asd123',
    });
  }
}
