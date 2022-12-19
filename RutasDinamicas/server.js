const http = require('http');
const url = require('url')

const routes = require('./routes/routes')
const router = routes.router;

const server = http.createServer((req, res) => {
  
   if(req.url.split('/')[1] === 'api' && req.url.split('/')[2] != undefined){
      console.log(`API DETECTADA >>> Nombre: ${req.url.split('/')[2]} | Metódo: ${req.method}`)

      if(req.url.split('/')[3] != undefined){
         //Si es distinto de indefinido, es porque hay un parametro en la api EJ. /api/product/1  donde "1" es el parametro.
         routes.routeDispatcher(req, res, req.url.split('/')[2] , req.url.split('/')[3]);
      }else{
         //Si no, es que no tiene y se manda null..
         routes.routeDispatcher(req, res, req.url.split('/')[2], null)
      }

      let URIDATA = {
          parsedURL: url.parse(req.url, true), // se parsea la url y se transforma en un objeto con parametros como la url, path y href
          path: '',
          qs: '',
          headers: req.headers, //datos de la conexion: host, datos del sistema etc.
          method: req.method.toLowerCase() //metodo GET, POST, PUT etc. en minuscula 
      }
      //console.log(URIDATA) //si lo necesitas ver en consola aca está
      URIDATA.path = URIDATA.parsedURL.pathname; //se saca el pathname de parsedURL ej. path: /api/products 
      URIDATA.qs = URIDATA.parsedURL.query; //se saca el query de tenerlo en parsedURL (no se usa en este caso)

      
      req.on("data", buffer => { 
          const strJSON = buffer.toString('utf-8')
          req.body = strJSON
          req.params = JSON.parse(JSON.stringify(URIDATA.parsedURL.query)); 
      }); //esto para guardar datos que se vayan a usar en metodo POST

      req.on("end", _ => {
        const route =
          typeof router.searchRoute(URIDATA.path, req.method) !== "undefined" //un if ternario. Si el tipo que resulta de buscar la ruta con el path y el metodo es distinto de undefined
          ? router.searchRoute(URIDATA.path, req.method)  //SI ES DISTINTO DE UNDEFINED, entonces buscalo.
          : (req, res) => { console.warn('⚠ |ERROR 404 -' + req.url )}; //SI NO ES DISTINTO DE UNDEFINED, entonces tira error 404.
     
    
          route(req, res) //lo de arriba
          routes.routeList() //se listan las rutas agregadas.
      });
              
              
   }else{
      res.write('<h1>Empieza generando alguna consulta de API!</h1>') //si no se  busca api muestra esto.
   }

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


