// import jsonwebtoken
const jwt = require('jsonwebtoken')

//import db.js
const db = require('./db')

//DATABASE
// db={
//     1000:{"acno":1000,"username":"Neer","password":1000,"balance":5000,transaction:[]},
//     1001:{"acno":1001,"username":"Laisha","password":1001,"balance":5000,transaction:[]},
//     1002:{"acno":1002,"username":"Vipin","password":1002,"balance":3000,transaction:[]}
//   }

  //register
  //register-asynchronous
 const register=(username,acno,password)=>{

  //asynchronous
  return db.User.findOne({
    acno
  }).then(user=>{
    if(user){
      return {
        status:false,
        message:"Already registered..Please Log In",
        statusCode:401
      }
    }
    else{
      // insert in db
      const newUser = new db.User({
        acno,
        username,
        password,
        balance:0,
        transaction:[]

      })
      newUser.save()
      return  {
        status:true,
        message:"Registered successfully",
        statusCode:200
      }
    }
  })
}
  

  //login -asynchronous

  const login = (acno,pswd)=>{
    
    return db.User.findOne({
      acno,
      password:pswd
    }).then(user=>{
      if(user){
        currentUser=user.username
        currentAcno=acno
        //token generation
      token = jwt.sign({
          //store account number inside token
          currentAcno:acno},'supersecretkey12345')
      
        return {
          status:true,
          message:"Login successful",
          statusCode:200,
          currentUser,
          currentAcno,
          token
        }
       
      }
      else{
        return {
          status:false,
          message:"Invali Account Number or Password",
          statusCode:401
        }
      }
    })
  }
    
  
  //deposit-asynchronous
  const deposit=(acno,password,amt)=>{
    var amount=parseInt(amt)
    return db.User.findOne({
      acno,password
    }).then(user=>{
      if(user){
        user.balance+=amount
user.transaction.push({
  type:"CREDIT",
  amount:amount
})
user.save()
return {
  status:true,
  message:amount+ "deposited succesfully..new balance is  "+user.balance,
  statusCode:200
}
  }
  else{
    return {
      status:false,
      message:"Invalid account Number or Password",
      statusCode:401
    }
  }
      })
    }
   
  //withdraw
 const withdraw = (acno,password,amt)=>{
    var amount=parseInt(amt)
    return db.User.findOne({
     acno,password 
    }).then(user=>{
      if(user){
        if(user.balance>amount){
        user.balance-=amount
user.transaction.push({
  type:"DEBIT",
  amount:amount
})
user.save()
return {
  status:true,
  message:amount+  "debited succesfully.. new balance is "+user.balance,
  statusCode:200
}
  }
  else{
    return{
      status:false,
      message:"insufficient balance",
      statusCode:422
    }
  }
}
  else{
    
    return  {
      status:false,
      message:"invalid account number or password",
      statusCode:422
    }
  }
      })
    }

  //transaction asynchronous
 const getTransaction=(acno)=>{
   return db.User.findOne({
     acno
   }).then(user=>{
if(user){
  return{
    status:true,
    transaction:user.transaction,
    statusCode:200
  
  }
}
else{
return  {
    status:false,
    message:"User doesnot exist!!!!",
    statusCode:401
  }
}

   })
   
  }
  //export
  module.exports={
    register,login,deposit,withdraw,getTransaction
  }
