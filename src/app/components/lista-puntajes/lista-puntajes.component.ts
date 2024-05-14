import { Component, inject } from '@angular/core';
import { ResultadosPuntajeService } from '../../services/resultados-puntaje.service';
import {
  resultadosInterface,
  resultadosInterfaceID,
} from '../../interface/resultados.interface';

@Component({
  selector: 'app-lista-puntajes',
  standalone: true,
  imports: [],
  templateUrl: './lista-puntajes.component.html',
  styleUrl: './lista-puntajes.component.css',
})
export class ListaPuntajesComponent {
  puntajes = inject(ResultadosPuntajeService);
  resultados: resultadosInterfaceID[] = [];

  ngOnInit() {
    this.puntajes.getAll().subscribe((data) => {
      data.sort((a: resultadosInterfaceID, b: resultadosInterfaceID) => {
        return b.puntaje - a.puntaje;
      });
      this.resultados = data;
    });
  }

  obtenerIndicePorId(resultados: resultadosInterfaceID[], id: String): number {
    for (let i = 0; i < resultados.length; i++) {
      if (resultados[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  buscarPosicionResultadoPorId(
    resultados: resultadosInterfaceID[],
    id: string
  ): number {
    var posicion = this.obtenerIndicePorId(resultados, id);
    posicion++;
    return posicion;
  }

  obtenerSvj(posicion: number) {
    if (posicion == 1 || posicion == 2 || posicion == 3) {
      return '../../../assets/estrella-del-trofeo.svg';
    } else {
      return '../../../assets/escudo-alternativo.svg';
    }
  }
}
