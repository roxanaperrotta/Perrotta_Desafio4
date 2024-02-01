import fs from "fs";

export class ProductManager{
    constructor (){
        this.filePath = "./src/json/products.json"
        this.products = []
        

    };

   
    async addProduct(title, description, price, code, thumbnail="imagen no disponible",  stock=10){
        
    // crear el producto nuevo

        const newProduct={
            id: this.products.length + 1,
            title,
            description,
            price, 
            thumbnail, 
            code,
            stock

        };

    // Validación de inputs

       if (typeof title !== 'string' || title.trim() === '') {
            return '!!Atención: Título inválido o faltante';
        }
        if (typeof description !== 'string') {
            return '!!Atención: Descripción inválida';
        }
        if (typeof price !== 'number' || price < 0) {
            return '!!Atención: Precio inválido';
        }
        if (typeof code !== 'string' || code.trim() === '') {
            return '!!Atención: Código inválido o faltante';
        }
        if (typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0) {
            return '!!Atención: Stock inválido';
        }

 //Revisar que no se dupliquen códigos

        const existingProduct=this.products.find(product=>product.code === code);

        if (existingProduct){
            return `!!Atención: Producto no agregado. El producto con código ${code} ya existe.`
        }

//Agregar al array  
 
        else{
              this.products.push(newProduct);   
              await fs.promises.writeFile (this.filePath, JSON.stringify (this.products, null, 2));
             // const productoAgregado =await fs.promises.readFile(this.filePath, 'utf8')
              //console.log(productoAgregado);
              return  `Producto con código ${code} agregado`
        };
       
    };
 
//Obtener productos

  
       

    async getProducts() {
        try {
            if (fs.existsSync(this.filePath)) {
                let fileContent = await fs.promises.readFile(this.filePath, 'utf8');
                this.products =  JSON.parse(fileContent);
                return this.products;
            }
        } catch (error) {
            console.error('Error reading or parsing the file:', error);
            return [];
        }
    }
    
//Obtener producto por id

    async getProductById(id){
       
      if (fs.existsSync(this.filePath)){
         let fileContent  =  await fs.promises.readFile(this.filePath, 'utf8');
         //console.log(fileContent)
         const data = JSON.parse(fileContent);
         const productoPorId=data.find((p)=>p.id==id); 
         //console.log(productoPorId)
         return productoPorId;
         }   
}
    
async updateProduct (id, updatedFields){
   
        let foundProduct = this.products.find(product=>product.id===id);
       
        if (foundProduct){
            let selectedProduct = foundProduct;
            Object.assign(selectedProduct, updatedFields);
            const updatedProductString = JSON.stringify(this.products, null, 2)
            await fs.promises.writeFile(this.filePath, updatedProductString);
            //console.log(foundProduct)
            return `El producto con ID ${id} fue modificado exitosamente. `
        }

       else { 
        return "Producto con ese ID no encontrado"
       }
    };
   
   async deleteProduct (id){
        
        let foundProduct = this.products.find(product=>product.id===id);

        if (foundProduct){

            let index = this.products.findIndex(product => product.id === id);
            if (index !== -1) {
                this.products.splice(index, 1);
            }
            
            try {
                const fileContent = await fs.promises.readFile(this.filePath, 'utf8');
                const data = JSON.parse(fileContent);
                const updatedData = data.filter(product=>product.id!== id);
                await fs.promises.writeFile(this.filePath, JSON.stringify(updatedData, null, 2));
                console.log (this.products);
                return `El producto con ID ${id} fue eliminado exitosamente`
             
            } catch (error) {
                return `Error eliminando el producto. Error ${error}`
            };
        }
        else{
            return `Producto con ID ${id} no encontrado`
        };
    };  
    
};



const productManager = new ProductManager()

export default ProductManager;
