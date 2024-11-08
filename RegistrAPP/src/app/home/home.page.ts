import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user: string = ''; 
  qrData = 'zttps://imgur.com/a/Sgu9L0o';  // Esto es lo que codificará el QR
  qrSize = 256;  // Tamaño del código QR
  constructor(private router: Router) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation?.extras.state) {
      this.user = currentNavigation.extras.state['user']; 
    }
  }
  goToCambiarPassword() {
    this.router.navigate(['/cambiar-password']); 
  }
  ngOnInit() {
    this.user = localStorage.getItem('user') || 'Invitado';
  }
}
