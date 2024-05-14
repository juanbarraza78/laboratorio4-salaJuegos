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
import { encuestaInterface } from '../../interface/encuesta.interface';
import { EncuestaService } from '../../services/encuesta.service';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.css',
})
export class EncuestaComponent {
  toastAlert = inject(ToastrService);
  fb = inject(FormBuilder);
  router = inject(Router);
  encuesta = inject(EncuestaService);

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
    numeroTelefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    juego: ['1', Validators.required],
    puntuacion: [1, Validators.required],
    condiciones: [false, Validators.requiredTrue],
  });

  onSubmit(): void {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      const encuestaAux: encuestaInterface = {
        email: value.nombre,
        nombre: value.apellido,
        apellido: value.nombre,
        edad: value.edad,
        numeroTelefono: value.numeroTelefono,
        juego: value.juego,
        puntuacion: value.puntuacion.toString(),
        condiciones: value.condiciones.toString(),
      };
      this.encuesta.saveAll(encuestaAux);
      this.toastAlert.success(
        'Gracias por participar en nuestra encuesta',
        'Encuesta enviada'
      );
    } else {
      this.toastAlert.error('Campos incorrectos', 'Encuesta Error');
    }
  }
}
