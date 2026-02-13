export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  user: {
    id: string;
    email: string;
    name: string;
  };
  accessToken: string;
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
