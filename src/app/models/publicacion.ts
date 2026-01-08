export interface Publicacion {
  id?: string;
  usuarioId: string;       // ID del usuario que crea la publicación
  mascotaNombre: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;     // Guardaremos la fecha como string ISO
  fechaFin: string;
  ubicacion: string;
  imagenUrl?: string;      // URL de la imagen en Firebase Storage
  createdAt: number;       // Fecha de creación (timestamp)
}