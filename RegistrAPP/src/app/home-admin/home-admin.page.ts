import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {
  user: string = ''; 
  qrData = 'zttps://imgur.com/a/Sgu9L0o';  // Esto es lo que codificará el QR
  qrSize = 256;  // Tamaño del código QR

  capturedImage: string | undefined;
  scannedResult: string = '';

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

  async openCamera() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera, // Usa CameraSource.Prompt para ofrecer opciones (cámara o galería)
    });

    this.capturedImage = image.dataUrl; // Guarda la imagen capturada
  }

  async startScanner() {
    // Pedir permiso para usar la cámara
    const result = await BarcodeScanner.checkPermission({ force: true });
    
    if (result.granted) {
      // Iniciar el escaneo
      BarcodeScanner.startScan().then((scanResult) => {
        if (scanResult.hasContent) {
          this.scannedResult = scanResult.content; // Mostrar el resultado
        } else {
          console.log('Escaneo cancelado o fallido');
        }
      });
    } else {
      console.log('Permiso denegado para usar la cámara');
    }
  }
  stopScanner() {
    BarcodeScanner.stopScan();
  }

}
