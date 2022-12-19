 const product = require("../controllers/productController.js");

 const productHandler = {
    GET: function(req, res, id) {if(id != null){product.getProduct(req,res,id)} else {product.getProducts(req, res)}},
    POST: function(req, res) {product.createProduct(req, res)},
    PUT: function(req, res, id) {product.updateProduct(req, res, id)},
    DEL: function(req, res, id) {product.deleteProduct(req,res,id)}
 }

function Router (){
    const Routes = {
        GET: {},
        POST: {},
        PUT: {},
        DEL: {}
    };
    
    const get = (url, callback) => {
      Routes.GET[url] = callback;
    }
    
    
    const post = (url, callback) => {
      Routes.POST[url] = callback;
    }
    
    
    const put = (url, callback) => {
      Routes.PUT[url] = callback;
    }
    
    
    const del = (url, callback) => {
      Routes.DEL[url] = callback;
    }
    
    return {
      'Routes': Routes,
      'get': get,
      'post': post,
      'put': put,
      'delete': del,
      'searchRoute':  (url, method) => {
         let route; 
            switch( method ) {
                case 'GET':  route = Routes.GET[url];    break;
                case 'POST': route = Routes.POST[url];   break;
                case 'PUT': route = Routes.PUT[url];     break;
                case 'DELETE': route = Routes.DEL[url];  break;
            }          
          return route;
      }
    }
    
}


const router = Router();

const routeDispatcher = (req, res, apiRouteName, apiID) => {

  //apiID es para saber si la consulta tiene algun parametro en el tercer slash. ej. /api/product/1. el apiID es 1 
  //apiRouteName es el nombre de la ruta y que se almacena al momento de ejecutar dicha consulta de API ej. /api/product se guarda "product"
  if(req.method === 'GET' && apiID == null){
      router.get(`/api/${apiRouteName}`, (req,res) => {productHandler.GET(req, res, apiID)})
  }
  if(req.method === 'GET' && apiID != null){
      router.get(`/api/${apiRouteName}/${apiID}`, (req,res) => {productHandler.GET(req, res, apiID)})
  }

  // ....
}

const routeList = (method) => {
  switch(method){
     default : console.log(router.Routes); break;
     case 'GET' : console.log(router.Routes.GET); break;
     case 'POST' : console.log(router.Routes.POST); break;
     case 'PUT' : console.log(router.Routes.PUT); break;
     case 'DEL' : console.log(router.Routes.DEL); break;
  }
  
}


module.exports = {
    router,
    routeDispatcher,
    routeList
}

