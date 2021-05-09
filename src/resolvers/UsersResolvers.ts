import 'reflect-metadata';
import { Arg, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

@ObjectType()
export class Role{    
  @Field()
  rolesName : string
}

@ObjectType()
export class UserHasRole{    
  @Field(() => Role)
  role  : Role   
}

@ObjectType()
export class Users{
  @Field()
  firstName : string
  @Field()
  lastName  : string
  @Field()
  address   : string
  @Field()
  email     : string
  @Field()
  password  : string
  @Field(() => UserHasRole)
  userhasrole      : UserHasRole
}

@Resolver()
export class UsersResolvers{
  @Query(() => [Users])
  async getUsers(){
    return await prisma.user.findMany({
      include:{
        userhasrole:{
          include:{
            role:true
          }
        }
      }
    });
  }
  @Mutation(() => Users)
  async insertUser(
    @Arg("firstName") firstName:string,
    @Arg("lastName") lastName:string,
    @Arg("address") address:string,
    @Arg("email") email:string,
    @Arg("password") password:string,
    @Arg("roleuser",()=>Int) roleuser:number,
  ){
    const saltRounds : number = 10;
    let newPasswordUser : string = bcrypt.hashSync(password, saltRounds); 
    const userCreate : any = {
      firstName:firstName,
      lastName:lastName,
      address:address,
      email:email,
      password:newPasswordUser
    }
    const newUser = await prisma.user.create({
      data:
        userCreate
    });
    await prisma.userHasRole.create({
      data:{
        roleId:roleuser,
        userId:newUser.userId
      }
    });
    return await prisma.user.findFirst({
      where:{
        userId:newUser.userId
      },
      include:{
        userhasrole:{
          include:{
            role:true
          }
        }
      }
    });
  }
  @Mutation(() => Users)
  async updateUser(
    @Arg("firstName") firstName:string,
    @Arg("lastName") lastName:string,
    @Arg("address") address:string,
    @Arg("email") email:string,
    @Arg("password",{nullable : true}) password:string,
    @Arg('userId',() => Int) userId:number
  ){
    var userUpdate : any = {
      firstName:firstName,
      lastName:lastName,
      address:address,
      email:email
    }
    const saltRounds : number = 10;    
    if (password) {
      let newPass : any = bcrypt.hashSync(password, saltRounds); 
      userUpdate.password = newPass
    }
    await prisma.user.update({
      where: { userId: userId },
      data: userUpdate,
    })
    return await prisma.user.findFirst({
      where:{
        userId:userId
      },
      include:{
        userhasrole:{
          include:{
            role:true
          }
        }
      }
    });
  }
  @Mutation(()=>[Users])
  async deleteUser(
    @Arg('userId') userId:number
  ){
    const getUser = await prisma.user.findFirst({
      where:{
        userId:userId
      },
      include:{
        userhasrole:true
      }
    });
    await prisma.userHasRole.delete({
      where:{userhasroleId:getUser?.userhasrole?.userhasroleId},      
    })  
    await prisma.user.delete({
      where:{userId:userId},      
    })
    return await prisma.user.findMany({
      include:{
        userhasrole:{
          include:{
            role:true
          }
        }
      }
    });
  }
}