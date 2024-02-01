import express from 'express';
import ProductManager from '../ProductManager.js';


const router = express.Router();
const prod = new ProductManager();

/*let productos = [
    {"id": 1,"title":"productoA",
"description":"descripcionA",
"price":2500,
"code":"prodA",
"stock":10,
"thumbnail":"none"
},
{"id": 2,"title":"productoB",
"description":"descripcionB",
"price":2800,
"code":"prodB",
"stock":10,
"thumbnail":"none"
},
{"id": 3,"title":"productoC",
"description":"descripcionC",
"price":3500,
"code":"prodC",
"stock":8,
"thumbnail":"none"
}
 ]*/

router.get ('/', (req, res) => {
    const productos = prod.getProducts();
    res.render ('home', {productos})
});

router.get ('/realtimeproducts', (req, res)=>{
    const productos = prod.getProducts();
    res.render('realTimeProducts', {productos})
})

export default router