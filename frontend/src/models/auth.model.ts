// Request model 
export interface LoginRequest {
  email: string;
  password: string;
  role:string;
}

// frontend/models/auth.ts

export interface SignupRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

// Response model 
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;

  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface SignupResponse {
  access_token: string;
  refresh_token?: string;

  user: {
    id: string;
    fullName: string;
    username: string;
    email: string;
  };
  message?: string;
}


