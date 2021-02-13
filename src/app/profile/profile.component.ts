import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../share/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  private _user!:User;
  constructor(
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data=>this._user=data.profile);
  }

  get user(){
    return this._user;
  }
}
