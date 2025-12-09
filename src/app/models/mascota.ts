export interface Mascota {
  id?: string;        // Firestore id (opcional)
  nombre: string;
  especie?: string;
  edad?: number;
  descripcion?: string;
  // añade los campos que necesites
}