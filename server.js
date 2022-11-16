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

const postSchema={
    feedback: String,
    imglink: String,
    cname:String,
    role:String
}        
const newPost=mongoose.model("feedback",postSchema)

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
        role:req.body.role            
    })
    console.log(newInsert)
    newInsert.save();
    res.redirect("/index.html");
})

const custSchema={
    fname: String,
    lname:String,
    emailid:String,
    mno:String,
    pwd:String,
    
}
const newCust=mongoose.model("registers",custSchema)
app.post("/insertUserData",function(req,res){
    let insert =new newCust({
        fname:req.body.fname,
        lname:req.body.lname,
        emailid:req.body.emailid,
        mno:req.body.mno,
        pwd:req.body.pwd,       
    })
    insert.save();
        res.redirect("/");
})

app.listen(3000,function(){
    console.log("server is running on 3000")
})
