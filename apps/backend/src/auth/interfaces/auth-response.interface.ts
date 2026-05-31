export interface AuthUserResponse {
  id: number;
  username: string;
  registeredAt: string;
  lastLogin: string | null;
}

export interface AuthSuccessResponse {
  message: string;
  user: AuthUserResponse;
}
