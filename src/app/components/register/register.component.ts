import { Component, ElementRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FirebaseStorageService } from '../../services/firebase-storage.service';
import { LogInterface } from '../../interface/log.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  authService = inject(FirebaseAuthService);
  router = inject(Router);
  elementRef = inject(ElementRef);
  fb = inject(FormBuilder);
  toastAlert = inject(ToastrService);
  storage = inject(FirebaseStorageService);

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    username: ['', Validators.required],
  });

  onSubmit(): void {
    const value = this.form.getRawValue();
    this.authService
      .register(value.email, value.username, value.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
          let log: LogInterface = {
            email: value.email,
            date: new Date(),
          };
          this.storage.saveAll(log);
        },
        error: () => {
          this.toastAlert.error(
            'Email, Username or Password incorrect',
            'Sing Up Error'
          );
        },
      });
  }
}
