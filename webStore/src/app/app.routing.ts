
import{ ModuleWithProviders } from '@angular/core';
import {Routes, RouterModule } from '@angular/router';

//se importan componentes del sitio 
import {InicioComponent} from '../app/componentes/inicio/inicio.component';
import {BusquedaComponent } from '../app/componentes/busqueda/busqueda.component';
import {ErrorComponent } from '../app/componentes/error/error.component';
import {ListadoProductosComponent} from '../app/componentes/listado-productos/listado-productos.component';
import {InicioSesionComponent} from '../app/componentes/inicio-sesion/inicio-sesion.component';
import {CrearProductoComponent} from '../app/componentes/crearProducto/crearProducto.component';
import {DescripcionProductoComponent} from '../app/componentes/descripcion-producto/descripcion-producto.component';
import {FormularioRegistroComponent} from '../app/componentes/formulario-registro/formulario-registro.component';
import {PerfilComponent} from '../app/componentes/perfil/perfil.component';
import { ValidarAuthGuard } from './validar-auth.guard';

const misRutas: Routes=[
    {path: '', component: InicioComponent},
    {path: 'inicio', component: InicioComponent},
    {path: 'listado', component: ListadoProductosComponent},
    {path: 'busqueda/:params', component: BusquedaComponent},
    {path: 'inicioSesion', component: InicioSesionComponent},
    {path: 'perfil/:id', component: PerfilComponent},
    {path: 'registro', component: FormularioRegistroComponent},
    {path: 'crearProducto', component: CrearProductoComponent, canActivate: [ValidarAuthGuard]},
    {path: 'detallesProducto/:id', component: DescripcionProductoComponent},
    {path: '**', component: ErrorComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(misRutas);