export interface CreateSessionResponseDTO {
  user: UserResponseDTO;
  token: string;
}

interface UserResponseDTO {
  id: string;
  email: string;
  name: string;
}
