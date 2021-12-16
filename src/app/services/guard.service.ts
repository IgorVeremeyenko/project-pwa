import { Injectable, Input } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  isLoggedIn!: boolean;
  
  constructor(private router: Router) { }
  canActivate(): boolean {   
    
    if(this.isLoggedIn){
      return true;
    }
    else{
      return false;
    }
    
  }
}
