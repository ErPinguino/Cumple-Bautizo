export interface Regalo {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: string | null;
}

export interface Invitado {
  id: number;
  nombre: string;
  regaloId: number;
  createdAt: Date;
}