import { async } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Plugins, CameraResultType } from '@capacitor/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Contact } from '@capacitor-community/contacts';
import { isPlatform } from '@ionic/angular';

const { Browser, Camera, Contacts } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  image = null;
  contacts = [];
  constructor(private sanitizer: DomSanitizer) {
    this.loadContacts();
  }

  openBrowser() {
    Browser.open({url: 'https://ukr.net'});
  }

  

  async loadContacts() {
    if (isPlatform('android')) {
      let permission = await Contacts.getPermissions();
      if(!permission.granted) {
        return;
      }
    }
    Contacts.getContacts().then(result => {
      console.log(result);
      for (const contact of result.contacts) {
          console.log(contact);
      }
  });
  }

  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });
    console.log(image);
    this.image = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpeg;base64,${image.base64String}`);
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    //var imageUrl = image.webPath;
    // Can be set to the src of an image now
    //imageElement.src = imageUrl;
  }
}
