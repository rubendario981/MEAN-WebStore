export class modeloProducto{
    constructor(
        public _id: string,
        public nombre: string,
        public marca: string,
        public descripcion: string,
        public categoria: string,
        public subCategoria: string,
        public precio: number,
        public precioPromo: number,
        public tiempoPromo: any,
        public fecha: Date,
        public imagen: string,
        public updatedAt: any
    ){}
}