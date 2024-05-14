import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { resultadosInterface } from '../../../interface/resultados.interface';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { ResultadosPuntajeService } from '../../../services/resultados-puntaje.service';

@Component({
  selector: 'app-mijuego',
  standalone: true,
  imports: [],
  templateUrl: './mijuego.component.html',
  styleUrl: './mijuego.component.css',
})
export class MijuegoComponent {
  blockSize = 25;
  rows = 20;
  cols = 20;
  board: any;
  context: any;

  snakeX = this.blockSize * 5;
  snakeY = this.blockSize * 5;
  velocityX = 0;
  velocityY = 0;
  snakeBody: any[] = [];
  foodX?: number;
  foodY?: number;
  gameOver = false;
  puntaje: number = 0;

  putajes = inject(ResultadosPuntajeService);
  authService = inject(FirebaseAuthService);

  constructor() {}

  ngOnInit(): void {
    this.board = document.getElementById('board');
    this.board.height = this.rows * this.blockSize;
    this.board.width = this.cols * this.blockSize;
    this.context = this.board.getContext('2d');

    this.placeFood();
    document.addEventListener('keyup', this.changeDirection.bind(this));
    setInterval(this.update.bind(this), 1000 / 10);
  }

  update() {
    if (this.gameOver) {
      return;
    }

    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.board.width, this.board.height);

    this.context.fillStyle = 'red';
    this.context.fillRect(
      this.foodX,
      this.foodY,
      this.blockSize,
      this.blockSize
    );

    if (this.snakeX == this.foodX && this.snakeY == this.foodY) {
      this.snakeBody.push([this.foodX, this.foodY]);
      this.placeFood();
      this.puntaje++;
    }

    for (let i = this.snakeBody.length - 1; i > 0; i--) {
      this.snakeBody[i] = this.snakeBody[i - 1];
    }
    if (this.snakeBody.length) {
      this.snakeBody[0] = [this.snakeX, this.snakeY];
    }

    this.context.fillStyle = 'green';
    this.snakeX += this.velocityX * this.blockSize;
    this.snakeY += this.velocityY * this.blockSize;
    this.context.fillRect(
      this.snakeX,
      this.snakeY,
      this.blockSize,
      this.blockSize
    );
    for (let i = 0; i < this.snakeBody.length; i++) {
      this.context.fillRect(
        this.snakeBody[i][0],
        this.snakeBody[i][1],
        this.blockSize,
        this.blockSize
      );
    }

    if (
      this.snakeX < 0 ||
      this.snakeX > this.cols * this.blockSize ||
      this.snakeY < 0 ||
      this.snakeY > this.rows * this.blockSize
    ) {
      this.gameOver = true;
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

    for (let i = 0; i < this.snakeBody.length; i++) {
      if (
        this.snakeX == this.snakeBody[i][0] &&
        this.snakeY == this.snakeBody[i][1]
      ) {
        this.gameOver = true;
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
  }

  changeDirection(e: KeyboardEvent) {
    if (e.code == 'ArrowUp' && this.velocityY != 1) {
      this.velocityX = 0;
      this.velocityY = -1;
    } else if (e.code == 'ArrowDown' && this.velocityY != -1) {
      this.velocityX = 0;
      this.velocityY = 1;
    } else if (e.code == 'ArrowLeft' && this.velocityX != 1) {
      this.velocityX = -1;
      this.velocityY = 0;
    } else if (e.code == 'ArrowRight' && this.velocityX != -1) {
      this.velocityX = 1;
      this.velocityY = 0;
    }
  }

  placeFood() {
    this.foodX = Math.floor(Math.random() * this.cols) * this.blockSize;
    this.foodY = Math.floor(Math.random() * this.rows) * this.blockSize;
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
      juego: 'Snake',
    };
    return await this.putajes.saveAll(resultadoAux);
  }
}
