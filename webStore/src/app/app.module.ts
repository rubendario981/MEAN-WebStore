import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { appRoutingProviders, routing } from './app.routing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { NubeTagsComponent } from './componentes/nube-tags/nube-tags.component';
import { BusquedaComponent } from './componentes/busqueda/busqueda.component';
import { FormularioRegistroComponent } from './componentes/formulario-registro/formulario-registro.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { ValidarAuthGuard } from './validar-auth.guard';
import { ValidaTokenService } from './modelos-servicios/valida-token.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavegacionComponent,
    ListadoProductosComponent,
    DescripcionProductoComponent,
    InicioSesionComponent,
    CrearProductoComponent,
    FooterComponent,
    NubeTagsComponent,
    BusquedaComponent,
    FormularioRegistroComponent,
    InicioComponent
  ],
  imports: [
    BrowserModule,
    routing,
    HttpClientModule,
    FormsModule,
    AngularFileUploaderModule
  ],
  providers: [
    appRoutingProviders, 
    ProductoService, 
    ValidarAuthGuard,
    { provide: HTTP_INTERCEPTORS, 
      useClass: ValidaTokenService,
      multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
