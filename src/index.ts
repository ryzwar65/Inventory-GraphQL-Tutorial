import 'reflect-metadata';
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchemaSync } from "type-graphql";
import { UsersResolvers } from './resolvers/UsersResolvers';
import * as dotenv from "dotenv";
// import * as cors from "cors";
import * as bodyParser from "body-parser";
// import * as helmet from "helmet";

dotenv.config()

async function serverMain(){
  const app = express();
  const server = new ApolloServer({
    schema: await buildSchemaSync({
      resolvers:[UsersResolvers]
    }),
    context:(({req,res}) => ({req,res}))
  });
  var allowlist = [process.env.ORIGIN];
  let corsOptionDelagete = function (req : any,callback: any){
    let corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { 
        origin: true,
        credentials: true,
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      } // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { 
        origin: false,
        credentials: true,
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      } // disable CORS for this request
    }
    callback(null, corsOptions)
  }  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  server.applyMiddleware({app,cors:corsOptionDelagete});
  var port = process.env.APP_PORT;  
  app.listen(port,()=>{
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    // console.log(`Server is Running on ${port}`);
  })  
}

serverMain();
