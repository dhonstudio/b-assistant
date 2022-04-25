export interface Users {
    id_user: number;
    email: string;
    password: string;
}

export interface UsersResult {
    response: string;
    status: number;
    data: Users[];
}

export interface UsersVerify {
    response: string;
    status: number;
    data: boolean;
}