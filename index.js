var AWS = require('aws-sdk');
const {
	v1: uuidv1,
	v4: uuidv4
	} = require('uuid')

var handler = async (event) => {
    var dynamodb = new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        endpoint: 'http://dynamodb:8000',
        region: 'us-west-2',
        credentials: {
        accessKeyId: '2345',
        secretAccessKey: '2345'
    }
    });
    var docClient = new AWS.DynamoDB.DocumentClient({
        apiVersion: '2012-08-10',
        service: dynamodb
    });
    
    switch(event.httpMethod) {
        case "GET":
         if (event.path == '/envios/pendientes') {
         let params = {
             TableName: 'Envio',
             IndexName: 'EnviosPendientes'
         };
     
         let response
         await docClient.scan(params, function(err, data) {
             if (err) {
                 response = { body: 'Error', statusCode: 400}	
             }else{
                 if (data.Items.length > 0) {
                     response = {body: data.Items, statusCode: 200}			
                 }else{
                     response = {body: 'No hay ningun envios pendientes', statusCode: 200}				
                 }		
             }
         
         }).promise();
         
          return response;
         }
         break;
         case "PUT":
         if (event.path === `/envios/${event.pathParameters.idEnvio}/entregado`) {
             let params = {
                 TableName : "Envio",
                 Key : {
                     'id': event.pathParameters.idEnvio    
                 },
                 UpdateExpression : "REMOVE pendiente",
                 ReturnValues : "ALL_NEW"        
             };
     
             let response
             await docClient.update(params, function(err, data) {
                 if (err) {
                     response = {body: 'Error', statusCode:400}
                 } else {
                     if (Object.keys(data.Attributes).length === 1) {
                         response = {body: `El envio con el id ${event.pathParameters.idEnvio} no existe`, statusCode:400}
                     }
                     else {
                         response = {body: JSON.stringify(data.Attributes), statusCode:200}
                     }
                 }
             }).promise();
             return response
         }
         break; 
        case "POST":
          if (event.path === '/envios') {
        let body = JSON.parse(event.body)     
         if (event.body == null) {
             return {body: 'El envio debe contener contener destino, email y pendiente', statusCode: 400}
         }
         if (body.email == null) {
            return {body: 'El envio debe contener contener el email', statusCode: 400}
        }
         
         if (body.destino == null) {
             return{body: 'El envio debe contener contener destino', statusCode: 400}
         }
         let params = {
             TableName: 'Envio',
             Item: {
             id: uuidv4(),
             fechaAlta: new Date().toISOString(),
             email: body.email,
             destino: body.destino,             
             pendiente: 's'
            }   
         };
     
         let response
         await docClient.put(params, function(err, data) {
             if (err) {
                 response = { body: 'Error al crear el envio', statusCode: 400}	
             }else{
                 response = { body: JSON.stringify(params.Item), statusCode: 200}
             }
         }).promise();
              return response;
         }
          break;
         default:
         return { body: "HTTP Method Not Supported", statusCode: 400}

    };
}
exports.handler = handler;