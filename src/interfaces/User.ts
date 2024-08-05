export interface SigninForm {
  email: string
  password: string
}
export interface SignupForm extends SigninForm {
  nickname: string
}
export interface SuccessSignupResponse {
  status: boolean
  uid: string
}
export interface SuccessSigninResponse {
  status: boolean
  exp: number
  token: string
  nickname: string
}
export interface SuccessSignoutResponse {
  status: boolean
  uid: string
}
export interface UserResponse {
  status: boolean
  message: string
}
