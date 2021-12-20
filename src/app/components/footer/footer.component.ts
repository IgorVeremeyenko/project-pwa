import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public linkedinUrl: string = 'https://www.linkedin.com/in/%D0%B8%D0%B3%D0%BE%D1%80%D1%8C-%D0%B2%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D0%B5%D0%BD%D0%BA%D0%BE-764184222/';
  public facebookUrl:string = 'https://www.facebook.com/gserviceelite';
  public githubUrl:string = 'https://github.com/IgorVeremeyenko';
  constructor() { }

  ngOnInit(): void {
  }

}
