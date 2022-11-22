const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname)); //to avoid sending static files using res.send file

mongoose.connect("mongodb+srv://bpc:1234@cluster0.7twssup.mongodb.net/bpc")

app.get("/",function(req,res){           
    res.sendFile(__dirname + '/index.html')
})


//Feedback Form
const postSchema={
    feedback: String,
    imglink: String,
    cname:String,
    place:String
}        
const newPost=mongoose.model("feedbacks",postSchema)

app.get("/load",(req,res)=>{
    newPost.find( (err,data)=>{
        if(err){
            return res.status(500).send(err)
        }
        else{
            return res.status(200).send(data)
        }
    })
})

app.post("/insertform",function(req,res){
    console.log(req.body)
    let newInsert=new newPost({                
        feedback:req.body.feedback,
        imglink:req.body.imglink,
        cname:req.body.cname,
        place:req.body.place            
    })
    console.log(newInsert)
    newInsert.save();
    res.redirect("/index.html#testimonials");
})


//Search Form       
app.post("/searchform", (req, res) => {
    newPost.findOne({cname:req.body.custname},(err, data) => {  
            console.log(data);            
            res.redirect("index.html#testimonials");                          
    });
  });


//Delete Form       
app.post("/deleteform",(req,res)=>{
    newPost.find({ "cname": req.body.customername}).deleteOne( (err, data) => {
        if (err) 
        {
            console.log(err)
        }
        else 
        {
            res.redirect("index.html#testimonials")
        }
        })
})


//Update Form     
app.post("/updateform",(req,res)=>{
    query = {
        cname: req.body.cn,    
    }
    update = {
        feedback: req.body.fb,    
     }
    newPost.updateOne(query,update, function (err, result) {
        if (err)
        {
            console.log(err)
        }
        else
        {
            console.log("Result :", result) 
            res.redirect("index.html#testimonials")
        }
        });   
})


//Registration Form
const custSchema={
    fname: String,
    lname:String,
    emailid:String,
    mno:String,
    pwd:String,
    
}
const newCust=mongoose.model("registers",custSchema)

app.post("/newcustomer",function(req,res){
    let insert =new newCust({
        fname:req.body.fname,
        lname:req.body.lname,
        emailid:req.body.emailid,
        mno:req.body.mno,
        pwd:req.body.pwd,       
    })
    newCust.find({ "fname": insert.fname, "lname": insert.lname, "emailid": insert.emailid, "mno": insert.mno, "pwd": insert.pwd, }, (err, data) => {
        if (err) 
        {
            console.log(err)
        }
        else if (data.length) 
        {
            res.redirect("/Error/registererror.html")
        }
        else 
        {
            insert.save();
            res.redirect("/Login/login.html")
        }
    })
    
})


//Change Password Form
app.post("/resetpwd",(req,res)=>{
    newCust.findOne({mno:req.body.mno, pwd: req.body.oldpwd},(err,data) =>{
    if (data != null) {
      if(req.body.newpwd==req.body.conewpwd)
      {
        newCust.updateOne(
          { 
            mno: req.body.mno, 
            pwd: req.body.oldpwd 
          },
          { 
            pwd: req.body.newpwd 
          },
          (err, data) => {
            if (err) 
            {
              console.log(err);
            } 
            else 
            {
              res.redirect("/Login/login.html");
            }
          }
        );
      }
     
    } 
    else 
    {
      res.redirect("/Error/rstpwderror.html");
    }
    });
    });



//Payment Form
const paySchema={
    cardNumber:String,
    cardHolderName:String,
    amt:String,
}
const newPay=mongoose.model("payments",paySchema)

app.post("/newpayment",function(req,res){
    let insert =new newPay({
        cardNumber:req.body.cardNumber,
        cardHolderName:req.body.cardHolderName,
        amt:req.body.amt,      
    })
    insert.save();
        res.redirect("/index.html#bookcamera");
})


//Meeting Form
const meetingSchema={
    name:String,
    email:String,
    phone:String,
    date:String,
    time:String,
    people:String,
}
const newMeeting=mongoose.model("meetings",meetingSchema)

app.post("/meetingsform",function(req,res){
    let insert =new newMeeting({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,   
        date:req.body.date,
        time:req.body.time,
        people:req.body.people,   
    })
    insert.save();
        res.redirect("/index.html");
})


//Contact Us Form
const contactusSchema={
    name:String,
    email:String,
    subject:String,
    message:String,
}
const newContactus=mongoose.model("contacts",contactusSchema)

app.post("/contactusform",function(req,res){
    let insert =new newContactus({
        name:req.body.name,
        email:req.body.email,
        subject:req.body.subject,   
        message:req.body.message,  
    })
    insert.save();
        res.redirect("/index.html#contact");
})

app.listen(3000,function(){
    console.log("server is running on 3000")
})
