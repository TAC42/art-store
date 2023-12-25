import { Component, HostBinding, OnDestroy, OnInit, inject } from '@angular/core';
// import { Subscription, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  @HostBinding('class.full') fullClass = true

  loneImg1: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703533506/ContactandAbout/hn6xwtxhyjukte3tdeqt.jpg'
  loneImg2: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703513505/Gallery/Sculpture/jyij4j04qy2bq7yeirmi.png'
  loneImg3: string = 'https://res.cloudinary.com/dv4a9gwn4/image/upload/v1703513504/Gallery/Sculpture/qy5s6xe5vjaej7oncsy6.png'
}