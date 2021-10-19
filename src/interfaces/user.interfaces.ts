import { JwtPayload } from 'jsonwebtoken';

export interface UserAttributes {
  id?: string;
  username: string;
  hashedPassword: string;
  email: string;
  mobileNumber: string;
  roles: string[];
}

export interface UserCreated {
  id: string;
  displayName: string;
  email: string;
  gender?: string;
  birthday?: string;
}

export interface UserPayload extends JwtPayload{
  id: string;
  usename: string;
  roles: string;
  iat: number;
  exp: number;
}
