import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { StepperOrientation } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ThemePalette } from '@angular/material/core';
import { DataService } from 'src/app/services/data.service';
import { Client } from 'src/app/interfaces/client';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Device } from 'src/app/interfaces/device';
import { Router } from '@angular/router';
import { slideInAnimation } from 'src/app/animations';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  animations: [
    slideInAnimation
  ]
})
export class AddClientComponent implements OnInit {

  pattern = /\([0-9]{3}\)\-[0-9]{3}\-[0-9]{2}\-[0-9]{2}/
  phoneMask = ['(', /\d/, /\d/, /\d/, ')', '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
  phoneFormGroup: FormGroup = new FormGroup({})
  clientNameFormGroup: FormGroup = new FormGroup({})
  deviceNameFormGroup: FormGroup = new FormGroup({})
  statusFormGroup: FormGroup = new FormGroup({})
  emailFormGroup: FormGroup = new FormGroup({})
  dateFormGroup: FormGroup = new FormGroup({})
  messageToolTip: string = "";

  newUser = new ClientsDevice();
  stepperOrientation: Observable<StepperOrientation>;
  isLinear = false;
  favoriteSeason!: string;
  seasons: string[] = ['Да', 'Нет'];
  @Input() color: ThemePalette;
  inputPhoneNumber!: string;
  phoneNumber!: string;
  clientName!: string;
  date!: Date;
  deviceName!: string;
  status!: boolean;
  isLoadingIcon: boolean = false;
  isChecked: boolean = false;
  isFailedToLoad: boolean = false;
  isNotConnectedToServer: boolean = false;
  progressBar: boolean = false;
  options: AnimationOptions = {
    path: '../assets/svg/87164-loading-animation.json',
  };
  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
  constructor(
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private httpService: DataService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {

    this.phoneFormGroup = this._formBuilder.group({
      number: ['', [Validators.required, Validators.pattern(this.pattern)]]
    });
    this.clientNameFormGroup = this._formBuilder.group({
      name: [''],
    });
    this.deviceNameFormGroup = this._formBuilder.group({
      deviceName: ['', Validators.required],
    });
    this.statusFormGroup = this._formBuilder.group({
      status: [false, Validators.requiredTrue],
    });
    this.emailFormGroup = this._formBuilder.group({
      email: [''],
    });
    this.dateFormGroup = this._formBuilder.group({
      date: ['', Validators.required],
    });

    
  }
  

  addClient() {

    if (this.newUser != null) {
      try {
        this.progressBar = true;
        console.log(this.newUser)
        this.httpService.addUser(this.newUser)
          .subscribe(() => {
            this._snackBar.open('Пользователь успешно добавлен', 'Ок', {
              duration: 3000
            });
            this.progressBar = false;
            this.router.navigateByUrl('')
          }, error => {
            this._snackBar.open(`Ошибка при добавлении: ${error.message}`, 'Ок', {
              duration: 5000
            });
            this.progressBar = false;
          })
      } catch (error) {
        this._snackBar.open(`Ошибка при добавлении: ${error}`, 'Ок', {
          duration: 5000
        });
        this.progressBar = false;
      }
    }
  }
  submitPhone(phoneNumber: string) {

    this.newUser.client.phoneNumber = phoneNumber
  }
  submitClientName() {
    this.newUser.client.name = this.clientNameFormGroup.value.name
  }

  submitStatus() {
    this.newUser.device.status = this.statusFormGroup.value.status
    this.addClient()
  }
  submitDeviceName() {
    this.newUser.device.deviceName = this.deviceNameFormGroup.value.deviceName
  }

  onNumberChange(event: string) {
    
    if (this.f.valid) {
      var number = JSON.stringify(event)
      var digits = number.replace(/\D/g, "")
      const phoneNumber = '+38' + digits;
      console.log(phoneNumber)
      this.isLoadingIcon = true;
      this.isChecked = true;
      this.isLoadingIcon = false; 
      this.isFailedToLoad = false; 
      if(this.f.valid){  
       
        this.submitPhone(phoneNumber)
      }
    }
  }



  get f() {
    return this.phoneFormGroup.get('number')!;
  }
}

export class ClientsDevice { 
  clientId: number = 0;
  deviceId: number = 0;
  client: User = new User();
  device: UserDevice = new UserDevice();
}

class User implements Client {
  id!: number;
  phoneNumber!: string;
  name!: string;
  email!: string;
  client!: Client;
  device!: Device;
}

class UserDevice implements Device {
  id!: number;
  dateToReturn!: Date;
  dateToAdd!: Date;
  deviceName!: string;
  status!: boolean;
  
}




