import { Timestamp, FieldValue } from '@angular/fire/firestore';

export interface Usuario {
  id?: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;

  createdAt?: Timestamp | FieldValue | null;
  lastLogin?: Timestamp | FieldValue | null;
  updatedAt?: Timestamp | FieldValue | null;

  roles?: {
    admin?: boolean;
    moderator?: boolean;
    user?: boolean;
    [key: string]: boolean | undefined;
  };

  direccion?: string;
  ciudad?: string;

  [key: string]: any;
}
