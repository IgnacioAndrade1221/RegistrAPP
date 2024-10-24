import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user: string = ''; // Variable para almacenar el username

  constructor(private router: Router) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation?.extras.state) {
      this.user = currentNavigation.extras.state['user']; // Recibe el username si existe en el estado
    }
  }

  ngOnInit() {
    this.user = localStorage.getItem('user') || 'Invitado';
  }
}
