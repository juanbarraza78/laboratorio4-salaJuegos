import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Carta {
  numero: number;
  palo: string;
  nombre: string;
  contenido: any[];
}

@Component({
  selector: 'app-mayormenor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayormenor.component.html',
  styleUrl: './mayormenor.component.css',
})
export class MayormenorComponent {
  mazo: Carta[] = [];
  cartaActual?: Carta;
  cartaSiguiente?: Carta;
  resultado?: string;
  puntaje: number = 0;
  constructor() {}

  ngOnInit(): void {
    this.crearMazo();
    this.iniciarJuego();
    console.log(this.mazo);
  }

  crearMazo() {
    const numeros = [
      'uno',
      'dos',
      'tres',
      'cuatro',
      'cinco',
      'seis',
      'siete',
      'ocho',
      'nueve',
      'diez',
    ];
    const palos = ['♠', '♥', '♣', '♦'];
    for (let i = 0; i < 10; i++) {
      for (const palo of palos) {
        const carta: Carta = {
          numero: i + 1,
          nombre: numeros[i],
          palo: palo,
          contenido: Array(i + 1).fill(0),
        };
        this.mazo.push(carta);
      }
    }
  }

  iniciarJuego() {
    this.cartaActual = this.obtenerCartaAleatoria();
    this.cartaSiguiente = this.obtenerCartaAleatoria();
    this.resultado = '';
  }

  obtenerCartaAleatoria(): Carta {
    const indice = Math.floor(Math.random() * this.mazo.length);
    return this.mazo[indice];
  }

  verificarAdivinanza(opcion: string) {
    this.cartaActual = this.cartaSiguiente;
    this.cartaSiguiente = this.obtenerCartaAleatoria();

    console.log(this.cartaActual);
    console.log(this.cartaSiguiente);
    if (
      (opcion === 'MAYOR' &&
        this.cartaActual &&
        this.cartaSiguiente.numero > this.cartaActual.numero) ||
      (opcion === 'MENOR' &&
        this.cartaActual &&
        this.cartaSiguiente.numero < this.cartaActual.numero) ||
      (opcion === 'IGUAL' &&
        this.cartaActual &&
        this.cartaSiguiente.numero === this.cartaActual.numero)
    ) {
      this.resultado = 'Correcto';
      this.puntaje++;
    } else {
      this.resultado = 'Incorrecto';
    }
  }
}
