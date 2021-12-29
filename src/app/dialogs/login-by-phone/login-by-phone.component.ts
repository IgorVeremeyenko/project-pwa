import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getAuth, linkWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult, PhoneAuthProvider, User, linkWithPhoneNumber, updateCurrentUser, updatePhoneNumber } from "firebase/auth";
import { UserToken } from 'src/app/interfaces/user-token';
import { MessagingService } from 'src/app/services/messaging.service';

@Component({
  selector: 'app-login-by-phone',
  templateUrl: './login-by-phone.component.html',
  styleUrls: ['./login-by-phone.component.scss']
})
export class LoginByPhoneComponent implements OnInit {

  auth = getAuth();
  OTP_Window: boolean = false;
  message!: string;
  confirmResult!: ConfirmationResult;
  otp_number: string = "";
  isLoading = false;
  phoneMask = ['(', /\d/, /\d/, /\d/, ')', '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
  otp_mask = [/\d/, '-', /\d/, '-', /\d/, '-', /\d/];
  pattern = /\([0-9]{3}\)\-[0-9]{3}\-[0-9]{2}\-[0-9]{2}/;
  form: FormGroup = new FormGroup({});
  applicationVerifier!: RecaptchaVerifier;
  phoneNumber!: string;
  verificationId!: any;
  token!: UserToken
  constructor(
    public dialogRef: MatDialogRef<LoginByPhoneComponent>,
    private readonly router: Router,
    private fb: FormBuilder,
    private messages: MessagingService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
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
      console.log(this.otp_number)
      this.confirmResult.confirm(this.otp_number)
        .then(r => {    
          if (r.user.displayName != null){
            this.message = `Добро пожаловать, ${r.user.displayName}`
            this.token.phoneNumber = r.user.phoneNumber!;
            this.messages.token.then(result => this.token.token = result);
          }
          else{
            this.message = `Добро пожаловать`         
            this.token.phoneNumber = r.user.phoneNumber!;
            this.messages.token.then(result => this.token.token = result);
          }
        })        
        .then((user) => {
          this.isLoading = true;             
          setTimeout(() => { this.dialogRef.close(); this.router.navigateByUrl('devices') }, 3000);
          this.isLoading = false;
        })
        .catch(err => console.log(err))
    }

  }

  linkWithProvider(user: any, phoneNumber: string, applicationVerifier: RecaptchaVerifier, OTP_num: string){
    linkWithPhoneNumber(user, phoneNumber, applicationVerifier).then(res => {
      console.log('succesfully linked!')
      // this.confirmResult = res;
      // this.confirmResult.confirm(OTP_num)
      // .then(() => {console.log('linked and confirmed')})
    })
    .catch(error => {console.log(error)})  
  }
  
  async SignIn(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
    try {      
      
      setPersistence(this.auth, browserLocalPersistence)
          .then(() => {
            this.applicationVerifier = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, this.auth);
            // signInWithPhoneNumber(this.auth, phoneNumber, this.applicationVerifier)
            //   .then((result) => {
            //     this.OTP_Window = true;
            //     this.message = `Мы отправили проверочный код на номер ${phoneNumber}, введите полученный код ниже`
            //     this.confirmResult = result;
            //     console.log(result)
                
            //   })
            // Obtain a verificationCode from the user.    
             linkWithPhoneNumber(this.auth.currentUser!, phoneNumber, this.applicationVerifier)
             .then(result => {
              this.OTP_Window = true;
              this.message = `Мы отправили проверочный код на номер ${phoneNumber}, введите полученный код ниже`
              this.confirmResult = result;
             })
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
  get f() {
    return this.form.get('mobileNumber')!;
  } 
      
      
}
  
    
