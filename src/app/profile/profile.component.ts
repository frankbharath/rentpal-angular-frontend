import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../core/login.service';
import { User } from '../share/models/user.model';
import { Utils } from '../share/utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  private _user!:User;
  constructor(
    private route:ActivatedRoute,
    private _loginService:LoginService,
    private _utils:Utils
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data=>this._user=data.profile);
  }

  get user(){
    return this._user;
  }

  deleteUser(){
    const dialogRef = this._utils.confirmDialog("Confirm Delete", "Deleting your profile is irreversible operation? Are you sure you want to delete?");
    dialogRef.afterClosed().subscribe(async dialogResult => {
      if(dialogResult){
        this._loginService.deleteUser();
      }
    });
  }
}
