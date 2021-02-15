import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _tokenTimeout: any;
  private _token = new BehaviorSubject<string>(null);
  private _userId = null;

  constructor(
    private http: HttpClient,
    private routr: Router
  ) { }
  
  getTokenListener() {
    return this._token.asObservable();
  }

  getUserId() {
    return this._userId;
  }

  
  signupNewUser(name: string, email: string, password: string) { 
    console.log(`@signupNewUser(name: ${name}, email: ${email}, password: ${password}) is runign...`);
    // TODO: we must accept email at backend
    const graphqlQuery = {query: `
      mutation {
        authBuild(auth: {
          authname: "${name}",
          password: "${password}",
          auth_type: ADMIN
        }) {
          auth_id
          authname
          auth_type
          roles 
        }
      }`}
    return this.http
    .post<{errors: any, data: {authBuild: any}}>("http://localhost:3000/graphql", graphqlQuery)
    .pipe(
      tap(authBuildResult => {
          if(authBuildResult.errors) {
            //! throw error
          }
          const fetchedData = authBuildResult.data.authBuild;
          console.log('@signupNewUser fetchedData> :', fetchedData);
          console.log("we are navigating to /auth/login page...");
          //auto logout
          // this.setTimerToClearLoacalAuthData(fetchedData.authData.expiresIn);
          // this.saveLoacallyAuthData(fetchedData.authData.token, fetchedData.authData.expiresIn, fetchedData.user._id);
          // this._userId = fetchedData.user._id;
          // this.routr.navigate(['/', 'auth', 'login']);
          this.routr.navigateByUrl('/auth/login'); //$ not working
          // this._token.next(fetchedData.authData.token);
        })
    )
  }
  
  signupNewUser00(name: string, email: string, password: string) {
    console.log(`@signupNewUser(name: ${name}, email: ${email}, password: ${password}) is runign...`);
    const graphqlQuery = {query: `
      mutation {
        createUser(userInput: {
          email: "${email}",
          name: "${name}",
          password: "${password}"
        }) {
          user {
            _id
            name
            email
          }
          authData {
            token
            expiresIn
          }
        }}`}
    return this.http
    .post<{ errors:[{ message: string }], 
            data: {             
              createUser: {
                user: {
                  _id: string,
                  name: string,
                  email: string }
                authData: {
                  expiresIn: number,
                  token: string }
    }}}>("http://localhost:3000/graphql", graphqlQuery)
    .pipe(
      tap(createUseResult => {
          const fetchedData = createUseResult.data.createUser;
          console.log('@signupNewUser fetchedData> :', fetchedData);
          if(!createUseResult.errors) {
            //auto logout
            this.setTimerToClearLoacalAuthData(fetchedData.authData.expiresIn);
            this.saveLoacallyAuthData(fetchedData.authData.token, fetchedData.authData.expiresIn, fetchedData.user._id);
            this._userId = fetchedData.user._id;
            this.routr.navigate(['/']);
            this._token.next(fetchedData.authData.token);
          }
        })
    )
  }

  loginUser(email: string, password: string) {
    console.log(`@loginUser(email: ${email}, password: ${password}) is runign...`);
    const graphqlQuery = {
      query: `
        {
          authLogin(loginAuthInput: {
            authname: "${email}",
            password: "${password}",
          }) {
            accessToken
          }
        }
      `
    }
    return this.http
    .post<{ errors:[ {message: string, 
                      status: number, 
                      data: [{message: string}]  }], 
            data: { 
              authLogin: { accessToken: string }  }
        }>
      ("http://localhost:3000/graphql", graphqlQuery)
      .pipe(
        tap(result => {
            const loginResult = result.data.authLogin;
            //auto logout
            // this._userId = loginResult.userId;
            this._token.next(loginResult.accessToken);
            // this.setTimerToClearLoacalAuthData(loginResult.expiresIn);
            // this.saveLoacallyAuthData(loginResult.token, loginResult.expiresIn, loginResult.userId);
            this.routr.navigate(['/', 'kasabe', 'tabs', 'tab5']);
          })
      )
  }
  
  loginUser00(email: string, password: string) {
    console.log(`@loginUser(email: ${email}, password: ${password}) is runign...`);
    const graphqlQuery = {
      query: `
        {
          authLogin(email: "${email}", password: "${password}") {
            token
            userId
            expiresIn
          }
        }
      `
    }
    return this.http
    .post<{ errors:[ {message: string, 
                      status: number, 
                      data: [{message: string}]  }], 
            data: { 
              login: { userId: string, expiresIn: number, token: string }  }
        }>
      ("http://localhost:3000/graphql", graphqlQuery)
      .pipe(
        tap(result => {
            const loginResult = result.data.login;
            //auto logout
            this._userId = loginResult.userId;
            this._token.next(loginResult.token);
            this.setTimerToClearLoacalAuthData(loginResult.expiresIn);
            this.saveLoacallyAuthData(loginResult.token, loginResult.expiresIn, loginResult.userId);
            this.routr.navigate(['/', 'kasabe', 'tabs', 'tab5']);
          })
      )
  }

  private saveLoacallyAuthData(token: string, durationms: number, userId: string) {
    console.log(`@saveLoacallyAuthData(token: ${token}, durationms: ${durationms}, userId: ${userId})`)
    localStorage.setItem('token', token);
    const expiresIn = new Date().getTime() + durationms;
    localStorage.setItem('expiresIn', expiresIn.toString());
    localStorage.setItem('userId', userId);
  }

  private setTimerToClearLoacalAuthData(durationms: number) {
    this._tokenTimeout = setTimeout(
      () => { this.logout(); },
      durationms
    );
  }

  autoAuthByLocalData() {
    const token = localStorage.getItem('token');
    const expiresIn = +localStorage.getItem('expiresIn');
    const userId = localStorage.getItem('userId');
    console.log('@@@@autoAuthByLocalData() token>; remain time to expire>: ', token, (expiresIn - new Date().getTime()));
    if(!token || !expiresIn || !userId) {
      console.log('@@@@autoAuthByLocalData() 1st IF token> expiresIn> userId>; ', token, (expiresIn - new Date().getTime()), userId);
      return;
    }
    if(expiresIn < new Date().getTime()) { //data is expired
      console.log('@@@@autoAuthByLocalData() 2end IF token>; (expiresIn < new Date().getTime())>: ', token, expiresIn < new Date().getTime() );
      localStorage.removeItem('token');
      localStorage.removeItem('expiresIn');
      localStorage.removeItem('userId');
      return;
    }
    this._userId = userId;
    this.setTimerToClearLoacalAuthData(expiresIn - new Date().getTime());
    this._token.next(token);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('userId');
    this._userId = null;
    this._token.next(null);
    clearTimeout(this._tokenTimeout);
  }

  ngOnDestroy() {
    this._token.unsubscribe();
  }
}
