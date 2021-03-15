import { environment } from './../../environments/environment';
export const AuthAPI={
    googleLogin:environment.oauth.google,
    facebookLogin:environment.oauth.fb,
    randmonLogin:'/login',
    isUserLoggedIn:'/user/session',
    deleteUser:'/user'
}