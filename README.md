# TP3_Computacion_Practica
1)Borrar en caso de que exista un contenedor con el nombre "dynamodb"
docker rm dynamodb

2)Crear red local
docker network create awslocal

3)Correr contenedor dynamodb en puerto 8000
docker run -p 8000:8000 --network awslocal --name dynamodb amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb

4)Abrir shell en explorador localhost:8000/shell

5)Copiar y pegar el contenido de CreateTabla.txt, en el shell y correr el script

6)Levantar sam
sam local start-api --docker-network awslocal

--Lista para usar--
