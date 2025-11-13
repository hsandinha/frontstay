export type UserRole = 'hospede' | 'proprietario' | 'administrador' | 'parceiros';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
    role: UserRole;
}
