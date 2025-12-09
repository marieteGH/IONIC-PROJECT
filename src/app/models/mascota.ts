export interface Mascota {
  id?: string;        // Firestore id (opcional)
  ownerId?: string;   // uid del usuario propietario
  nombre: string;
  especie?: string;
  edad?: number;
  descripcion?: string;
  // añade los campos que necesites
}