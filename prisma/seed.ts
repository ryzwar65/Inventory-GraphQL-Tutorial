import { PrismaClient } from "@prisma/client";
import {roleSeed} from "./roleSeed";
import permissions from "./permissionSeed";
// var moment = require('moment');  
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  for (let rolesSeed of roleSeed) {   
    await prisma.role.create({    
      data: rolesSeed
    }) 
  }
  for(let perm of permissions){
    await prisma.permission.create({
      data:perm
    })
  }   
  const perm : any = await prisma.permission.findMany();  
  const role : any = await prisma.role.findFirst({
    where:{rolesName:"admin"},            
  });      
  perm.map(async (itemPerm : any)=>{
    await prisma.roleHasPermission.create({
      data:{
        permissionId:itemPerm.permissionId,
        roleId:role.roleId
      }
    }).catch((err)=>{
      console.log("Error Role has Perm",err);
    })
  })
  const permForKaryawan = await prisma.permission.findMany({
    where:{
      NOT:[
        {
          permissionName:"create_log"
        },
        {
          permissionName:"read_log"
        },
        {
          permissionName:"update_log"
        },
        {
          permissionName:"delete_log"
        }
      ]
    }
  })
  const roleKaryawan : any = await prisma.role.findFirst({
    where:{
      rolesName:"karyawan"
    }
  });
  permForKaryawan.map(async (permkar)=>{
    await prisma.roleHasPermission.create({
      data:{
        permissionId:permkar.permissionId,
        roleId:roleKaryawan.roleId
      }
    })
  })
  const saltRounds : number = 10;
  const passwords : string = "password";
  let passwordAdmin : string = bcrypt.hashSync(passwords, saltRounds);
  // let createdAt : any = moment("YYYY-MM-DD hh:mm:ss",true);
  // Admin
  const userAdmin : any = {
    firstName:"Super",
    lastName:"Admin",
    email:"admin@example.com",
    address:"Cirebon",
    password:passwordAdmin    
  } 
  await prisma.user.createMany({
    data: [
      userAdmin,   
    ]
  })
  var getUserAdmin = await prisma.user.findMany();
  getUserAdmin.map(async (item : any)=>{
    if (item.userId==1) {
      await prisma.userHasRole.create({
        data:{
          roleId:1,
          userId:1,
        }
      })
    }
  })
}
main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })