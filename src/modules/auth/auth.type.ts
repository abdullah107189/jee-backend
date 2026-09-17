export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IVerifyOTPRequest {
  email: string;
  otp: string;
}

export interface IResendOTPRequest {
  email: string;
}
