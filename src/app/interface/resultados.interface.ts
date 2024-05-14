export interface resultadosInterfaceID extends resultadosInterface {
  id: String;
}

export interface resultadosInterface {
  puntaje: number;
  userName: string | undefined;
  date: string;
  dateOrder: any;
  juego: string;
}
