import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { appRoutingProviders, routing } from './app.routing';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './componentes/header/header.component';
import { NavegacionComponent } from './componentes/navegacion/navegacion.component';
import { ListadoProductosComponent } from './componentes/listado-productos/listado-productos.component';
import { DescripcionProductoComponent } from './componentes/descripcion-producto/descripcion-producto.component';
import { FooterComponent } from './componentes/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavegacionComponent,
    ListadoProductosComponent,
    DescripcionProductoComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    routing, //modulo de 
    HttpClientModule
  ],
  //appRoutingProviders es un servicio(provider)
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
