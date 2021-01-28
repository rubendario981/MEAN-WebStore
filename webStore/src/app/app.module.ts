import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { appRoutingProviders, routing } from './app.routing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFileUploaderModule } from 'angular-file-uploader'
import { MomentModule } from 'angular2-moment';
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
import { ComunicandoComponentesService } from './modelos-servicios/ComunicandoComponentes.service';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { ListaFavoritosComponent } from './componentes/lista-favoritos/lista-favoritos.component';
import { CarritoComprasComponent } from './componentes/carrito-compras/carrito-compras.component';

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
    InicioComponent,
    PerfilComponent,
    ListaFavoritosComponent,
    CarritoComprasComponent
  ],
  imports: [
    BrowserModule,
    routing,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFileUploaderModule,
    MomentModule
  ],
  providers: [
    appRoutingProviders, 
    ProductoService, 
    ComunicandoComponentesService,
    ValidarAuthGuard,
    { provide: HTTP_INTERCEPTORS, 
      useClass: ValidaTokenService,
      multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
