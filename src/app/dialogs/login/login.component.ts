import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import {
  browserLocalPersistence,
  ConfirmationResult,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  linkWithPhoneNumber,
  RecaptchaVerifier,
  setPersistence,
  signInWithPhoneNumber,
  signInWithPopup
} from 'firebase/auth';
import { AuthComponent } from 'src/app/auth/auth.component';
import { UserToken } from 'src/app/interfaces/user-token';
import { DataService } from 'src/app/services/data.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { LoginByPhoneComponent } from '../login-by-phone/login-by-phone.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild(ModalDirective) modal!: ModalDirective;
  private googleLogoURL = "https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";
  private path: string = "../../../assets/svg/";
  pattern = /\([0-9]{3}\)\-[0-9]{3}\-[0-9]{2}\-[0-9]{2}/
  auth = getAuth();
  form: FormGroup = new FormGroup({});
  myModel: any;
  isInvalid = true;
  phoneMask = ['(', /\d/, /\d/, /\d/, ')', '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
  otp_mask = [/\d/, '-', /\d/, '-', /\d/, '-', /\d/];
  isLoading = false;
  OTP_Window: boolean = false;
  message: string = "";
  otp_number: string = "";
  confirmResult!: ConfirmationResult;
  providerGoogle = new GoogleAuthProvider();
  providerFacebook = new FacebookAuthProvider();
  token = new UserToken;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AuthComponent,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LoginComponent>,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private messages: MessagingService,
    private dataService: DataService
  ) {
    this.matIconRegistry.addSvgIcon('google', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'google.svg'))
    this.matIconRegistry.addSvgIcon('facebook', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'facebook.svg'))
  }

  ngOnInit(): void {
    console.log(this.data)
    this.form = this.fb.group({
      mobileNumber: [
        '',
        [
          Validators.maxLength(15),
          Validators.minLength(10),
          Validators.pattern(this.pattern)
        ],
      ],
    });
  }
  submit(event: any) {
    var number = JSON.stringify(this.form.value.mobileNumber)
    var digits = number.replace(/\D/g, "")
    const phoneNumber = "+38" + digits;
    console.log(phoneNumber);
    this.SignIn(phoneNumber)
    this.isLoading = true;
    //this.form.reset();
    //this.dialogRef.close();
  }
  onOtpChange($event: any) {
    console.log($event)
    if ($event.length == 6) {
      this.otp_number = $event
      this.confirmResult.confirm(this.otp_number)
        .then(r => {
          if (r.user.displayName != null){
            this.message = `Добро пожаловать, ${r.user.displayName}`
            this.token.phoneNumber = r.user.phoneNumber!;
            this.messages.token.then(result => this.token.token = result);
          }
          else
            this.message = `Добро пожаловать`
        })
        .then(() => {
          this.isLoading = true;
          setTimeout(() => { this.dialogRef.close(); this.router.navigateByUrl('') }, 3000);
          this.isLoading = false;
        })
        .catch(err => console.log(err))
    }

  }
  confirmation(result: ConfirmationResult) {
    console.log(result)
    result.confirm(this.otp_number)
      .then(r => {
        this.router.navigateByUrl('');
      })
      .catch(err => console.log(err))
  }
  async SignIn(phoneNumber: string) {
    try {

      setPersistence(this.auth, browserLocalPersistence)
        .then(() => {
          const applicationVerifier = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, this.auth);
          signInWithPhoneNumber(this.auth, phoneNumber, applicationVerifier)
            .then((result) => {
              this.OTP_Window = true;
              this.message = `Мы отправили проверочный код на номер ${phoneNumber}, введите полученный код ниже`
              this.confirmResult = result;
              console.log(result)
            })
           
          // Obtain a verificationCode from the user.            
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          this.message = errorMessage;
        })


    } catch (error) {
      console.log('error', error)
    }
  }
  signInGoogle() {
    this.dialogRef.close()
    
    signInWithPopup(this.auth, this.providerGoogle)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;
        // The signed-in user info.
        const user = result.user;
        if (!user.phoneNumber) {
          this.dialog.open(LoginByPhoneComponent, { disableClose: true, data: this.auth.currentUser })
        }
        
        this.token.phoneNumber = user.phoneNumber!;
        const dsfds = this.messages.token.then(result => this.token.token = result);        
        this.dataService.registerTokenForUser(this.token)
        .subscribe(t => console.log(t), error => console.log(error))
        // setPersistence(this.auth, browserLocalPersistence).then(() => {
        //   const token = this.messages.token.then(result => {
        //     this.dataService.checkToken(result!)
        //   });
          
        //   this.router.navigateByUrl('');
        // })
        this.router.navigateByUrl('');
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        this.message = errorMessage;
        console.log(error)
        // ...
      });
  }
  get f() {
    return this.form.get('mobileNumber')!;
  }

}
