import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanLoad {

  isLogged = false;
  constructor(private router: Router, private readonly dataService: DataService) { }
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
    return this.dataService.checkAuth()!.onAuthStateChanged(user => {
      if(user){
        this.isLogged = true;
        return true;
      }
      else {
        this.isLogged = false;
        return false;
      }
    }) ? 
    true : 
    this.router.navigateByUrl('authorization');
    
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
         
    return this.dataService.checkAuth() ? true : this.router.navigate(['costumers']);
  }
  
  
  
  }
