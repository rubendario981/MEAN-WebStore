import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { appRoutingProviders, routing } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AngularFileUploaderModule } from 'angular-file-uploader'
import { ProductoService } from './modelos-servicios/producto.service'

import { AppComponent } from './app.component';
import { HeaderComponent } from './componentes/header/header.component';
import { NavegacionComponent } from './componentes/navegacion/navegacion.component';
import { ListadoProductosComponent } from './componentes/listado-productos/listado-productos.component';
import { DescripcionProductoComponent } from './componentes/descripcion-producto/descripcion-producto.component';
import { InicioSesionComponent } from './componentes/inicio-sesion/inicio-sesion.component';
import { CrearProductoComponent } from './componentes/crearProducto/crearProducto.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavegacionComponent,
    ListadoProductosComponent,
    DescripcionProductoComponent,
    InicioSesionComponent,
    CrearProductoComponent,
    FooterComponent
  ],
  imports: [
    //se importan los modulos funcionales 
    BrowserModule,
    routing,
    HttpClientModule,
    FormsModule,
    AngularFileUploaderModule
  ],
  //se agregan los servicios o providers
  providers: [appRoutingProviders, ProductoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
