import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { OrderPipe } from 'ngx-order-pipe';
import { ApiService, HelpersService, InitService, ZonaHorariaService } from 'src/app/services/service.index';
import { ChangeCreatorDialog } from '../../modals/change-creator/change-creator-dialog';

import * as moment from 'moment-timezone';

@Component({
  selector: 'rsv-main-frame',
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.css']
})
export class MainFrameComponent implements OnInit, AfterViewInit {

  @Input() data = {}
  @Output() reload = new EventEmitter

  loading = {}
  comment = ''
  history = []
  showMore = false

  hideInsXld = true

  constructor( 
    public domSanitizer: DomSanitizer,
    public _init: InitService,
    private _api: ApiService,
    private orderPipe: OrderPipe,
    public _h: HelpersService,
    private _zh: ZonaHorariaService,
    public dialog: MatDialog ) { }

  ngOnInit(): void {
    this.getHistory( this.data['mlTicket'] )
    this.getRsvHistory( this.data['master']['zdUserId'] )
  }

  ngAfterViewInit(): void {
  }


  // **************************** APIS INICIO ****************************

    getHistory( tkt = this.data['mlTicket'] ){

      this.showMore = false

      this.loading['history'] = true

      this._api.restfulGet( tkt, 'Rsv/getHistory' )
                  .subscribe( res => {

                    this.loading['history'] = false;

                    this.history = this.orderPipe.transform(res['data'], 'Fecha', true)

                  }, err => {
                    this.loading['history'] = false;

                    const error = err.error;
                    this._init.snackbar('error',err.statusText, error.msg);
                    console.error(err.statusText, error.msg);

                  });
    }

    sendComment(){
      this.loading['comment'] = true

      this._api.restfulPut( {ticket: this.data['mlTicket'], comment: this.comment}, 'Rsv/sendComment' )
                  .subscribe( res => {

                    this.loading['comment'] = false;
                    this.comment = ''
                    this.getHistory( this.data['mlTicket'] )

                  }, err => {
                    this.loading['comment'] = false;

                    const error = err.error;
                    this._init.snackbar('error',err.statusText, error.msg);
                    console.error(err.statusText, error.msg);

                  });
    }

    updateRelatedTicket(){
      this.loading['rlTicket'] = true

      this._api.restfulPut( {loc: this.data['master']['masterlocatorid'] }, 'Calls/getZdItemRelated' )
                  .subscribe( res => {

                    this.loading['rlTicket'] = false;
                    this._init.snackbar( 'success', 'Actualizado', res['msg'] );
                    this.reload.emit( this.data['master']['masterlocatorid'] )

                  }, err => {
                    this.loading['rlTicket'] = false;

                    const error = err.error;
                    this._init.snackbar( 'error', error.msg, err.status );
                    console.error(err.statusText, error.msg);

                  });
    }

    sendMailConfirm(){
      this.loading['sendConf'] = true

      this._api.restfulPut( {loc: this.data['master']['masterlocatorid']}, 'Rsv/sendFullConf' )
                  .subscribe( res => {

                    this.loading['sendConf'] = false;
                    this._init.snackbar('success','Enviado!', res['msg'])
                    this.getHistory()

                  }, err => {
                    this.loading['sendConf'] = false;

                    const error = err.error;
                    this._init.snackbar('error', error.msg, err.status );
                    console.error(err.statusText, error.msg);

                  });
    }

    getRsvHistory( zdClientId = this.data['master']['zdUserId'] ){

      this.loading['rsvHistory'] = true
      this.data['rsvHistory'] = []

      this._api.restfulGet( zdClientId, 'Rsv/getRsvHistory' )
                  .subscribe( res => {

                    this.loading['rsvHistory'] = false;
                    let rh = []

                    this.data['rsvHistory'] = res['data']

                  }, err => {
                    this.loading['rsvHistory'] = false;

                    const error = err.error;
                    this._init.snackbar( 'error', error.msg, err.status );
                    console.error(err.statusText, error.msg);

                  });
    }

    addBlacklist(){
      this.loading['loc'] = true

      this._api.restfulPut( {ml: this.data['master']['masterlocatorid'], zdId: this.data['master']['zdUserId']}, 'Rsv/addBlacklist' )
                  .subscribe( res => {

                    this.reload.emit( this.data['master']['masterlocatorid'] )
                  }, err => {
                    this.loading['loc'] = false;

                    const error = err.error;
                    this._init.snackbar( 'error', error.msg, err.status );
                    console.error(err.statusText, error.msg);

                  });
    }

    removeBlacklist(){
      this.loading['loc'] = true

      this._api.restfulPut( {ml: this.data['master']['masterlocatorid'], zdId: this.data['master']['zdUserId']}, 'Rsv/resetBlacklist' )
                  .subscribe( res => {

                    this.reload.emit( this.data['master']['masterlocatorid'] )
                  }, err => {
                    this.loading['loc'] = false;

                    const error = err.error;
                    this._init.snackbar( 'error', error.msg, err.status );
                    console.error(err.statusText, error.msg);

                  });
    }

    addCourtesyTransfer( flag = true ){
      this.loading['cTransfer'] = true

      this._api.restfulPut( {loc: this.data['master']['masterlocatorid'], flag}, 'Rsv/hasTransfer' )
                  .subscribe( res => {

                    this.loading['cTransfer'] = false;
                    this._init.snackbar( 'success', 'Traslado', res['msg'] );
                    this.data['master']['hasTransfer'] = flag
                    this.getHistory()

                  }, err => {
                    this.loading['cTransfer'] = false;

                    const error = err.error;
                    this._init.snackbar( 'error', error.msg, err.status );
                    console.error(err.statusText, error.msg);

                  });
    }
    
  // **************************** APIS FIN ****************************



  // **************************** VALIDADORES INICIO ****************************

  // **************************** VALIDADORES FIN ****************************



  // **************************** FORMATOS INICIO ****************************

    formatHistory( t ){
      let r = t

      r = r.replace(/[\n]/gm,'<br>')

      return r
    }

  // **************************** FORMATOS FIN ****************************
  

  // **************************** DIALOGS INICIO ****************************

    chCreatorDialog( d:any = null ): void {
      const dialogRef = this.dialog.open(ChangeCreatorDialog, {
        data: d,
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if( result ){
          this.getHistory( this.data['mlTicket'] )
        }
      });
    }

  // **************************** DIALOGS FIN ****************************
}
