import express from 'express';
import path from 'path';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import viewsRouter from './src/routes/views.router.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import ProductManager from "./src/ProductManager.js"

const prod =  new ProductManager ();



const app = express();
const PORT = 8080;

//Middlewares

app.use (express.json());
app.use (express.urlencoded({extended:true}));



const _fileName =  fileURLToPath (import.meta.url);
const _dirname = dirname(_fileName);

app.use(express.static(path.join (_dirname, '/src/public')));

//Configuración para handlebars

app.engine("handlebars", handlebars.engine());
app.set("views", _dirname + '/src/views');
app.set ("view engine", "handlebars")


app.use ('/', viewsRouter);
app.use ('/realtimeproducts', viewsRouter)


const httpServer = app.listen(PORT, () =>  console.log (`Server running on PORT ${PORT}`));

//Conexión con socket.io

const socketServer = new Server (httpServer)


socketServer.on("connection" , socket =>{
    console.log ("Nueva conexión");

    try {
        const products = prod.getProducts();
        socketServer.emit("products", products);
    } catch (error) {
        socketServer.emit('response', { status: 'error', message: error.message });
    }
    
   socket.on("new-Product", async (newProduct) => {
        try {
            const objectProductNew = {
                    title: newProduct.title,
                    description: newProduct.description,
                    code: newProduct.code,
                    price: newProduct.price,
                    stock: newProduct.stock,
                    thumbnail: newProduct.thumbnail,
    
            }
            const pushProduct = prod.addProduct(objectProductNew);
            const updatedListProd = prod.getProducts();
            socketServer.emit("products", updatedListProd);
            socketServer.emit("response", { status: 'success' , message: pushProduct});

        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    })

    socket.on("delete-product", async(id) => {
        try {
            const pid = parseInt(id)
            const deleteProduct = prod.deleteProduct(pid)
            const updatedListProd = prod.getProducts()
            socketServer.emit("products", updatedListProd)
            socketServer.emit('response', { status: 'success' , message: "producto eliminado correctamente"});
        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    } )

})





