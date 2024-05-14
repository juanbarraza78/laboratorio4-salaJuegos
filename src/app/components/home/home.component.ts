import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FirebaseAuthService } from '../../services/firebase-auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  authService = inject(FirebaseAuthService);
  router = inject(Router);

  slides = [
    {
      id: 1,
      url: '../../../assets/ahorcado.png',
      title: 'Ahorcado',
      des: 'juego en el que debes adivinar una palabra oculta letra por letra antes de que se complete un dibujo del ahorcado. Cada letra incorrecta añade una parte al dibujo, acercándote al fallo. Es un desafío de palabras divertido y clásico que pone a prueba tu habilidad para adivinar.',
    },
    {
      id: 2,
      url: '../../../assets/preguntados.png',
      title: 'Preguntados',
      des: 'juego de preguntas y respuestas donde compites para avanzar en un tablero respondiendo preguntas de diferentes categorías. Es divertido y desafiante para poner a prueba tu conocimiento.',
    },
    {
      id: 3,
      url: '../../../assets/masMenos.png',
      title: 'Mas o Menos',
      des: 'juego de cartas donde los jugadores adivinan si la siguiente carta será de mayor o menor valor que la actual. Su simplicidad lo hace ideal para pasar el tiempo de forma divertida y rápida.',
    },
    {
      id: 4,
      url: '../../../assets/puzzle.png',
      title: 'Snake',
      des: 'juego clásico donde controlas una serpiente que crece a medida que consume alimentos en pantalla. Debes evitar chocar contra las paredes o tu propia cola para continuar. Es adictivo y simple de jugar, perfecto para pasar el tiempo.',
    },
  ];

  currentIndex: number = 0;
  timeoutId?: number;

  ngOnInit(): void {
    this.resetTimer();
  }

  ngOnDestroy() {
    window.clearTimeout(this.timeoutId);
  }

  resetTimer() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => this.goToNext(), 5000);
  }

  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide
      ? this.slides.length - 1
      : this.currentIndex - 1;

    this.resetTimer();
    this.currentIndex = newIndex;
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.slides.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;

    this.resetTimer();
    this.currentIndex = newIndex;
  }

  goToSlide(slideIndex: number): void {
    this.resetTimer();
    this.currentIndex = slideIndex;
  }

  getCurrentSlideUrl() {
    return `${this.slides[this.currentIndex].url}`;
  }

  getCurrentSlideTitle() {
    return `${this.slides[this.currentIndex].title}`;
  }

  getCurrentSlideDes() {
    return `${this.slides[this.currentIndex].des}`;
  }

  jugarAhora() {
    if (this.currentIndex == 0) {
      this.router.navigateByUrl('/ahorcado');
    } else if (this.currentIndex == 1) {
      this.router.navigateByUrl('/preguntados');
    } else if (this.currentIndex == 2) {
      this.router.navigateByUrl('/mayormenor');
    } else if (this.currentIndex == 3) {
      this.router.navigateByUrl('/mijuego');
    }
  }
}
