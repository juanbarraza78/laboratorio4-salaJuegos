import { Component, OnInit, inject } from '@angular/core';
import { PreguntadosService } from '../../../services/preguntados.service';
import { result } from '../../../interface/result.interface';
import Swal from 'sweetalert2';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { ResultadosPuntajeService } from '../../../services/resultados-puntaje.service';
import { resultadosInterface } from '../../../interface/resultados.interface';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css',
})
export class PreguntadosComponent implements OnInit {
  opcionUno?: string;
  opcionDos?: string;
  opcionTres?: string;
  opcionCuatro?: string;
  opcionCorrecta?: string;
  puntaje: number = 0;
  pregunta: string = '';
  arrayPreguntas: result[] = [];
  numeroPregunta: number = 1;
  indiceActual: number = 0;

  private preguntados = inject(PreguntadosService);
  putajes = inject(ResultadosPuntajeService);
  authService = inject(FirebaseAuthService);

  ngOnInit(): void {
    this.preguntados.getData().subscribe(
      (data: any) => {
        this.arrayPreguntas = data.results; // array de preguntas - respuestas
        console.log(this.arrayPreguntas);
        this.pasarProximaPregunta();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  pasarProximaPregunta() {
    this.opcionCorrecta = this.arrayPreguntas[this.indiceActual].correct_answer;
    const opcionesAll: string[] = [];
    this.pregunta = this.arrayPreguntas[this.indiceActual].question;

    opcionesAll.push(this.arrayPreguntas[this.indiceActual].correct_answer);
    opcionesAll.push(
      this.arrayPreguntas[this.indiceActual].incorrect_answers[0]
    );
    opcionesAll.push(
      this.arrayPreguntas[this.indiceActual].incorrect_answers[1]
    );
    opcionesAll.push(
      this.arrayPreguntas[this.indiceActual].incorrect_answers[2]
    );

    //Opcion 1
    const indiceAleatorio1 = Math.floor(Math.random() * opcionesAll.length);
    this.opcionUno = opcionesAll[indiceAleatorio1];

    //Opcion 2
    let indiceAleatorio2;
    do {
      indiceAleatorio2 = Math.floor(Math.random() * opcionesAll.length);
    } while (indiceAleatorio2 === indiceAleatorio1);
    this.opcionDos = opcionesAll[indiceAleatorio2];

    //Opcion 3
    let indiceAleatorio3;
    do {
      indiceAleatorio3 = Math.floor(Math.random() * opcionesAll.length);
    } while (
      indiceAleatorio3 === indiceAleatorio1 ||
      indiceAleatorio3 === indiceAleatorio2
    );
    this.opcionTres = opcionesAll[indiceAleatorio3];

    //Opcion 4
    let indiceAleatorio4;
    do {
      indiceAleatorio4 = Math.floor(Math.random() * opcionesAll.length);
    } while (
      indiceAleatorio4 === indiceAleatorio1 ||
      indiceAleatorio4 === indiceAleatorio2 ||
      indiceAleatorio4 === indiceAleatorio3
    );
    this.opcionCuatro = opcionesAll[indiceAleatorio4];
  }

  verificarRespuesta(opcion: string) {
    if (opcion == 'opcion1' && this.opcionUno == this.opcionCorrecta) {
      this.puntaje++;
    } else if (opcion == 'opcion2' && this.opcionDos == this.opcionCorrecta) {
      this.puntaje++;
    } else if (opcion == 'opcion3' && this.opcionTres == this.opcionCorrecta) {
      this.puntaje++;
    } else if (
      opcion == 'opcion4' &&
      this.opcionCuatro == this.opcionCorrecta
    ) {
      this.puntaje++;
    }
    if (this.numeroPregunta < 3) {
      this.numeroPregunta++;
      this.indiceActual++;
      this.pasarProximaPregunta();
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Felicidades! Terminaste!!! 😁',
        text: 'Cantidad de puntos ganados: ' + this.puntaje,
        confirmButtonText: 'Oka',
      }).then(() => {
        this.guardarPuntaje().then(() => {
          window.location.reload();
        });
      });
    }
  }

  empezarNuevoJuego() {
    window.location.reload();
  }

  async guardarPuntaje() {
    console.log('entro puntaje');
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
      juego: 'Preguntados',
    };
    return await this.putajes.saveAll(resultadoAux);
  }
}
