import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { AplicacionPagosCieloComponent } from './aplicacion-pagos-cielo/aplicacion-pagos-cielo.component';

import { LinkGeneratorComponent } from './link-generator/link-generator.component';
import { LinkReportComponent } from './link-report/link-report.component';
import { PagosRegistroComponent } from './pagos-registro/pagos-registro.component';

const childRoutes: Routes = [
  { 
    path: 'linkGenerator', 
    component: LinkGeneratorComponent , 
    canActivate: [ AuthGuard ],
    data: { title: 'Generacion de Links de Pago', role: 'payment_linkGenerator' } 
  },
  { 
    path: 'linkReport', 
    component: LinkReportComponent, 
    canActivate: [ AuthGuard ],
    data: { title: 'Reporte de Links de Pago', role: 'payment_linkGenerator' }
  },
  { 
    path: 'paymentReg', 
    component: PagosRegistroComponent, 
    canActivate: [ AuthGuard ],
    data: { title: 'Registro de pagos no automaticos', role: 'rsv_paymentReg' }
  },
  { 
    path: 'pagosCielo', 
    component: AplicacionPagosCieloComponent, 
    canActivate: [ AuthGuard ],
    data: { title: 'Aplicación de Pagos en CIELO', role: 'rsv_paymentCieloApply' }
  },
]



@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ChildRoutesModule { }
