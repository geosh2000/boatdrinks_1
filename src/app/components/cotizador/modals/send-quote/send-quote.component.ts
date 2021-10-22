import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-send-quote',
  templateUrl: './send-quote.component.html',
  styleUrls: ['./send-quote.component.css']
})
export class SendQuoteComponent implements OnInit {

  @ViewChild('createQuoteStepper') _stepper:MatStepper 

  stepperOrientation: Observable<StepperOrientation>;
  step = 0
  editOptional = false

  firstFormGroup = this._formBuilder.group({
    newTicket: [true, Validators.required]
  });

  secondFormGroup = this._formBuilder.group({
    user: [ '' ],
    ticket: [ '' ]
  });

  quoteForm = this._formBuilder.group({
    selectedLang: [ 'idioma_es', Validators.required ],
    ticket: [ '', Validators.required ],
    zdUser: [ '' ],
    isNewTicket: [ true ],
    quoteData: [ this.data ]
  });

  loading = {}

  languages = {
    'idioma_es': 'Español',
    'idioma_en': 'Inglés',
    'idioma_pt': 'Portugués',
  }
  selectedLang = 'idioma_es'

  constructor(
    public quoteDialog: MatDialogRef<SendQuoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    breakpointObserver: BreakpointObserver,
    private _formBuilder: FormBuilder,
  ) { 

    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
          .pipe(
            map(({matches}) => matches ? 'horizontal' : 'vertical')
        );

    this.firstFormGroup.get('newTicket').valueChanges.subscribe( x => {
      if( x == false ){
        this.quoteForm.get('ticket').enable();   
        this.quoteForm.get('isNewTicket').setValue(x)
      }else{
        this.quoteForm.get('ticket').disable() 
        this.quoteForm.get('isNewTicket').setValue(x)
      }
    })

  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.quoteDialog.close();
  }

  stepChange( e ){
    console.log( e )
    switch ( e.selectedIndex ){
      case 2:
        if( this.firstFormGroup.get('newTicket').value ){
          this.quoteForm.get('ticket').disable()
        }else{
          this.quoteForm.get('ticket').enable()
        }
        break
      default:
        break
    }

    this.step = e.selectedIndex

  }

  changeFirstStep(){
    if( this.firstFormGroup.get('newTicket').value ){
      this.step = 1
    }else{
      this.step = 2
    }
  }

  selected( e ){
    console.log( e )
    
    this.quoteForm.get('selectedLang').setValue( e.idioma_cliente )
    this.quoteForm.get('zdUser').setValue( e )

    this.step = 2
  }

  getErrorMessage( ctrl, form = this.quoteForm ) {

   
    if (form.get(ctrl).hasError('required')) {
      return 'Este valor es obligatorio';
    }
    
    if (form.get(ctrl).hasError('email')) {
      return 'El valor debe tener formato de email';
    }
    
    if (form.get(ctrl).hasError('min')) {
      return 'El valor debe ser mayor o igual a ' + form.get(ctrl).errors.min.min;
    }
    
    if (form.get(ctrl).hasError('max')) {
      return 'El valor debe ser menor o igual a ' + form.get(ctrl).errors.max.max;
    }
    
    if (form.get(ctrl).hasError('pattern')) {
      return 'Solo letras. No "ñ" ni apóstrofes. Revisa los espacios al inicio y al final';
    }
    
    if (form.get(ctrl).hasError('finMenorIgual')) {
      return 'La fecha final debe ser mayor al inicio';
    }
    
    if (form.get(ctrl).hasError('inicioPasado')) {
      return 'La fecha inicial no puede ser en el pasado';
    }
    
    return 'El campo tiene errores';
  }

  sendQuote(){
    console.log(this.quoteForm)
  }
}
