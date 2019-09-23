import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Storage} from '@ionic/storage';
 import { Router,CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardsGuard implements CanActivate  {
  constructor(private storage:Storage, private route:Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    const isComplete = await this.storage.get('tutorialComplete');

    if (!isComplete) {
      this.route.navigateByUrl('/onboarding');
    }

    return isComplete;
  }
}
