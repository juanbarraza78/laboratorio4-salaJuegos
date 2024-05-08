import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FirebaseChatService } from '../../services/firebase-chat.service';
import { messageInterface } from '../../interface/message.interface';
import { CommonModule, NgFor } from '@angular/common';
import { FirebaseAuthService } from '../../services/firebase-auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  chat = inject(FirebaseChatService);
  fb = inject(FormBuilder);
  authService = inject(FirebaseAuthService);

  estaActivo = true;

  cambiarEstado() {
    this.estaActivo = !this.estaActivo;
  }

  messages?: messageInterface[] = [
    {
      text: 'hola',
      userName: 'Jota',
      date: new Date().toDateString(),
    },
  ];

  ngOnInit() {
    this.chat.getAll().subscribe((messages) => {
      this.messages = messages;
    });
  }

  form = this.fb.nonNullable.group({
    mensaje: ['', Validators.required],
  });

  enviarMensaje() {
    const value = this.form.getRawValue();

    let fecha = new Date();

    let message: messageInterface = {
      text: value.mensaje,
      userName: this.authService.currentUserSig()?.username || '',
      date: `${fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })} - ${fecha.toLocaleTimeString()}`,
    };

    this.chat.saveAll(message);
    this.form.setValue({ mensaje: '' });
  }
}
