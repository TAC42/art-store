import { Injectable, inject } from '@angular/core'
import { HttpService } from './http.service'
import { Observable, throwError, catchError, tap, of } from 'rxjs'
import { User, UserCredentials, UserSignup } from '../models/user'

const SESSION_KEY_LOGGEDIN_USER = 'loggedinUser'
const BASE_URL = 'user/'

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private httpService = inject(HttpService)

  query(): Observable<User[]> {
    return this.httpService.get<User[]>(BASE_URL).pipe(
      catchError(error => {
        console.error('Error fetching users:', error)
        return throwError(() => new Error('Error fetching users'))
      })
    )
  }

  getById(userId: string): Observable<User> {
    return this.httpService.get<User>(`${BASE_URL}by-id/${userId}`).pipe(
      catchError(error => {
        console.error('Error fetching user by ID:', error)
        return throwError(() => new Error('Error fetching user'))
      })
    )
  }

  remove(userId: string): Observable<any> {
    return this.httpService.delete(`${BASE_URL}delete/${userId}`)
  }

  save(user: User): Observable<User> {
    if (user) {
      return this.httpService.put<User>(`${BASE_URL}update/${user._id}`, user)
    } else return this.httpService.post<User>(`${BASE_URL}add`, user)
  }

  login(userCred: UserCredentials): Observable<User> {
    return this.httpService.post<User>('auth/login', userCred).pipe(
      tap(user => this.setLoggedinUser(user)),
      catchError(error => {
        console.error('Error during login:', error)
        return throwError(() => new Error('Error during login'))
      })
    )
  }

  signup(signupData: UserSignup): Observable<User> {
    return this.httpService.post<User>('auth/signup', signupData).pipe(
      tap(newUser => {
        console.log('Registered user:', newUser.fullName)
        this.setLoggedinUser(newUser)
      }),
      catchError(error => {
        console.error('Error during signup:', error)
        return throwError(() => new Error('Error during signup'))
      })
    )
  }

  logout(): Observable<any> {
    return this.httpService.post<void>('auth/logout', null).pipe(
      tap(() => sessionStorage.removeItem(SESSION_KEY_LOGGEDIN_USER)),
      catchError(error => {
        console.error('Cannot logout:', error)
        return of({ error: true, message: 'Logout failed. Please try again.' })
      })
    )
  }

  static getLoggedinUser(): User {
    const user = sessionStorage.getItem(SESSION_KEY_LOGGEDIN_USER)
    return user ? JSON.parse(user) : null
  }

  setLoggedinUser(user: User): void {
    const userForSession = {
      _id: user._id,
      isVerified: user.isVerified
    }
    sessionStorage.setItem(SESSION_KEY_LOGGEDIN_USER, JSON.stringify(userForSession))
  }

  static getDefaultUser(): User {
    return {
      _id: '',
      username: '',
      fullName: '',
      email: '',
      imgUrl: 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1704381304/PlaceholderImages/evddzhxtr6kropnslvdb.png',
      password: '',
      cart: [],
      createdAt: 0,
      isAdmin: false,
      isVerified: false
    }
  }
}