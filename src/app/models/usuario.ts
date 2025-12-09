import firebase from 'firebase/compat/app';
// también importa compat firestore para que los tipos existan en tiempo de compilación
import 'firebase/compat/firestore';

export interface Usuario {
  id?: string; // uid de Firebase (opcional en creación local)
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;

  // Timestamps de Firestore (pueden ser Timestamp del servidor o FieldValue cuando hacemos writes)
  createdAt?: firebase.firestore.Timestamp | firebase.firestore.FieldValue | null;
  lastLogin?: firebase.firestore.Timestamp | firebase.firestore.FieldValue | null;
  updatedAt?: firebase.firestore.Timestamp | firebase.firestore.FieldValue | null;

  roles?: {
    admin?: boolean;
    moderator?: boolean;
    user?: boolean;
    [key: string]: boolean | undefined; // permite roles adicionales
  };

  // Campos opcionales del perfil
  direccion?: string;
  ciudad?: string;

  // Permitir campos adicionales si se añaden más propiedades en Firestore
  [key: string]: any;
}