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
    { id: 1, url: '../../../assets/ahorcado.png', title: 'Ahorcado' },
    { id: 2, url: '../../../assets/preguntados.png', title: 'Preguntados' },
    { id: 3, url: '../../../assets/masMenos.png', title: 'Mas o Menos' },
    { id: 4, url: '../../../assets/puzzle.png', title: 'Puzzle' },
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

  jugarAhora() {
    if (this.currentIndex == 0) {
      this.router.navigateByUrl('/ahorcado');
    } else if (this.currentIndex == 2) {
      this.router.navigateByUrl('/mayormenor');
    }
  }
}
