// properties for request singin
export interface ISignInRequest {
  emailOrPhone: string;
  password: string;
}

// properties for responde singin
export interface ISignInResponse {
  token: string;
}
