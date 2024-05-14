import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ResultadosPuntajeService } from '../../../services/resultados-puntaje.service';
import { resultadosInterface } from '../../../interface/resultados.interface';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css',
})
export class AhorcadoComponent {
  title = 'Ahorcado';
  palabraOculta = '';
  intentos = 0;
  gano = false;
  perdio = false;
  puntaje = 0;
  letras = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];

  botonesHabilitados: boolean[] = Array(this.letras.length).fill(true); // Inicialmente, todos los botones están habilitados

  palabras: string[] = [
    'Manzana',
    'Perro',
    'Gato',
    'Casa',
    'Sol',
    'Arbol',
    'Computadora',
    'Pelota',
    'Montana',
    'Libro',
    'Guitarra',
    'Pintura',
    'Jirafa',
    'Elefante',
    'Chocolate',
    'Pizza',
    'Rio',
    'Avion',
    'Barco',
    'Telefono',
    'Camara',
    'Luna',
    'Estrella',
    'Camisa',
    'Pantalon',
    'Zapatos',
    'Sombrero',
    'Reloj',
    'Calcetines',
    'Flor',
    'Silla',
    'Mesa',
    'Tren',
    'Globo',
    'Helado',
    'Mariposa',
    'Dinosaurio',
    'Helicoptero',
    'Pescado',
    'Tortuga',
    'Platano',
    'Heladera',
    'Radio',
    'Espejo',
    'Guitarra',
    'Teclado',
    'Escalera',
    'Piano',
    'Sirena',
    'Cepillo',
  ];
  palabra = this.palabraAleatoria().toLowerCase();

  palabraAleatoria(): string {
    const indiceAleatorio = Math.floor(Math.random() * this.palabras.length);
    return this.palabras[indiceAleatorio];
  }

  constructor(private router: Router) {
    this.palabraOculta = '_ '.repeat(this.palabra.length);
  }

  putajes = inject(ResultadosPuntajeService);
  authService = inject(FirebaseAuthService);

  guardarPuntaje() {
    let fecha = new Date();
    const resultadoAux: resultadosInterface = {
      puntaje: this.puntaje,
      userName: this.authService.currentUserSig()?.email,
      date: `${fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })} - ${fecha.toLocaleTimeString()}`,
      dateOrder: fecha,
      juego: 'Ahorcado',
    };
    this.putajes.saveAll(resultadoAux);
  }

  comprobar(letra: any) {
    this.existeLetra(letra);
    const palabraOcultaArreglo = this.palabraOculta.split(' ');

    const indice = this.letras.indexOf(letra);
    if (indice !== -1) {
      this.botonesHabilitados[indice] = false;
    }

    for (let i = 0; i <= this.palabra.length; i++) {
      if (this.palabra[i] === letra) {
        palabraOcultaArreglo[i] = letra;
      }
    }
    this.palabraOculta = palabraOcultaArreglo.join(' ');
    this.verificaGanador();
  }

  verificaGanador() {
    const palabraArr = this.palabraOculta.split(' ');
    const palabraEvaluar = palabraArr.join('');

    if (palabraEvaluar === this.palabra) {
      this.gano = true;
      this.puntaje = this.palabra.length + 7 - this.intentos;
      Swal.fire({
        icon: 'success',
        title: 'Felicidades! Ganaste!!! 😁',
        text: 'Cantidad de puntos ganados: ' + this.puntaje,
      }).then(() => {
        this.guardarPuntaje();
      });
    }
    if (this.intentos === 7) {
      this.perdio = true;
      Swal.fire({
        icon: 'error',
        title: 'Lo siento 😭 Perdiste!',
        html: 'La palabra correcta era: <b>' + this.palabra + '</b>',
      });
    }
  }

  existeLetra(letra: any) {
    if (this.palabra.indexOf(letra) >= 0) {
    } else {
      this.intentos++;
    }
  }

  empezarNuevoJuego() {
    window.location.reload();
  }
}
