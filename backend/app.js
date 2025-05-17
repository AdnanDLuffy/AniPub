const express = require("express");
const app = express();
const morgan = require("morgan");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const Data = require("./models/model");
const newList = require("./models/list");
const { error, profile } = require("console");
const OP = require("./Data/data");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {AuthAcc} = require("./middleware/valideAcc.js");
const bcrypt = require("bcrypt");

let accountId = "";

const DataBaseId = 'mongodb+srv://NodeDB:asdf1234@cluster0.cbnst.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


const port = 3000;

mongoose.connect(DataBaseId)
.then(()=>{
    console.log(`Data Base Connected Successfully`);
    app.listen(port,"0.0.0.0",(error)=>{
        if (error) {
            console.log(error);
        }
        console.log(`Server Listening on Localhost:${port}`);
    });
})
.catch(error=>{
    console.log(error);
})



app.use(express.static(path.join(__dirname,"../style")));

app.use(express.static(path.join(__dirname,"../profilePic")));
app.use(express.static(path.join(__dirname,"../ratings")));
app.use(express.static(path.join(__dirname,"../Video")));
app.use(express.static(path.join(__dirname,"../Cover")));
app.use(express.static(path.join(__dirname,"../icon")));
app.use(express.static(path.join(__dirname,"../image")));
app.use(express.static(path.join(__dirname,"../JS")));
app.use(express.static(path.join(__dirname,"../Logo")));
app.use(express.static(path.join(__dirname,"../Poster Pic")));
app.use(express.static(path.join(__dirname,"../Styles")));

app.use(express.urlencoded({extended:true}));


app.use(morgan("dev")); 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"../views-ejs"));

app.use(express.json());
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/Home",(req,res)=>{
    const Token = req.cookies.anipub;
    if(Token){
        jwt.verify(Token,"I Am Naruto",(err,data)=>{
            if(err) {
                console.log(err);
            }
            
           
             res.render("Home",{Anime:OP,auth:true,ID:data.id});
        })
    }
    else {
        res.render("Home",{Anime:OP,auth:false,ID:"guest"});
    }
    
    
})


app.get("/Sign-Up",(req,res)=>{
    res.render("Sign-Up")
})

// cookie

const TokenGen = (id) =>{
   return jwt.sign({id},"I Am Naruto",{expiresIn:60*24*60*3});
}

app.post("/Sign-Up",async (req,res)=>{
    try {
        const newacc = await Data.create({
        Name:req.body.name,
        Email : req.body.email,
        Password : req.body.pass,
    })
    const id = newacc._id;
    const myCookie = TokenGen(id);
    res.cookie("anipub",myCookie,{httpOnly:true,maxAge:60*24*60*3});
    res.json(["/Home"])
    

    } catch (err) {
     const errorObj = [{error:err.message}];   
     res.json(errorObj);
     
    }
})

app.post("/Login",async(req,res)=>{
    const Email = req.body.email;
    const Pass = req.body.pass;
    Data.findOne({"Email":Email})
    .then(
        info =>{
            if(info) {
                bcrypt.compare(Pass,info.Password,(err,value)=>{
                    if(error) {
                        console.log(error)
                    }
                    if(value) {
                        const myCookie = TokenGen(info._id);
                        res.cookie("anipub",myCookie,{httpOnly:true,maxAge:3*60*60*24});
                        res.json(["/Home"]);
                       }
                       else {
                        res.json(["Email or Pass is wrong"])
                 
                       }
                   })
                  
            }
            else {
                res.json(["Could't find any account with this account"])
            }
        }
    )
})
app.get("/Login",(req,res)=>{
    res.render("Login");
})
app.get("/Profile/:id",AuthAcc,(req,res)=>{
   const profileID = req.params.id;
   const Token = req.cookies.anipub;
   if(Token){
       jwt.verify(Token,"I Am Naruto",(err,data)=>{
           if(err) {
               console.log(err);
           };
            Data.findById(profileID)
            .then(info=>{
                 const userInfo = {
                     ID : info._id,
                     Name : info.Name,
                     Email :info.Email,
                 }
                 res.render("Profile",{SectionName:"Profile",Auth:true,userInfo})
            })
            .catch(err=>{console.log("Account could not be found")})     
          
       })
   }
   

 
})


app.get(`/AniPlayer/:AniId/:AniEP`,(req,res)=>{
    const Array = req.url;
    const newArray = Array.split("/")
    const AniId = Number(newArray[2]);
    const AniEP = Number(newArray[3]);
    res.render("AniPlayer",{AniDB : OP,AniId,AniEP})
});

app.get("/PlayList",(req,res)=>{
    newList.find()
    .then(info=> {
        res.render("PlayList",{SectionName:"PlayList Section",List: info,AniDB:OP,Auth:false});
    })
    
})

app.get('/PlayList/Update/:AniID/:AniEP',(req,res)=>{
    const Array = req.url;
    const newArray = Array.split("/");
    const AniID = newArray[3];
    const AniEP = newArray[4];
    const upList = new newList({
        AniID : AniID,
        AniEP : AniEP,
        Date: Date(),
    });
    upList.save()
    .then(info=> {
        res.redirect("/PlayList")
    })

})




app.get('/PlayList/Delete/:DeleteID',(req,res)=>{
    newList.findByIdAndDelete(req.params.DeleteID)
    .then (info=> {
        res.redirect("/PlayList")
    })
    .catch(error=>{
        console.log(error)
    })
})

//Update --- false auth to cheking
app.get("/About-Us",(req,res)=>{
    res.render("About-Us",{SectionName:"About Us Section",Auth:false});
})

app.get("/Privacy-Policy",(req,res)=>{
    res.render("Privacy-Policy",{SectionName:"Privacy Policy Section",Auth:false});
});
app.get("/Uploader",(req,res)=>{
    res.render("Uploader",{SectionName:"Uploader Section"});
});

app.get("/Upload",(req,res)=>{
    const AnidB = new AniDB({
        Anime:[
             {   Anime: "One Piece",
                ImagePath: "One-Piece.jpg",
                Cover:"One Piece.jpg",
                Name:"One Piece",
                Synonyms: "OP",
                poster:"One-Piece.jpg",
                Aired: "Oct 20,1999 to ?",
                Premiered: "Fall 1999",
                Duration: "24m",
                Status: "Currently Airing",
                MALScore: "8.62",
                RatingsNum:40,
                Genres:"Action,Adventure,Comedy,Drama,Fantasy",
                Studios: "Toei Animation",
                Producers: "Fuji TV, TAP, Shueisha, Toei Animation, Funimation, 4Kids Entertainment",
                DescripTion:"One Piece is an iconic anime that follows the journey of Monkey D. Luffy, a young pirate with the extraordinary ability to stretch his body like rubber after consuming a Devil Fruit. Driven by his dream to become the Pirate King, Luffy sets sail to find the legendary treasure known as \"One Piece,\" said to be hidden at the end of the Grand Line. As Luffy assembles his diverse crew, the Straw Hat Pirates, they encounter a world filled with rich lore, complex characters, and deep mysteries. Each crew member has their own aspirations, from becoming the world's greatest swordsman to finding a long-lost friend, adding layers of depth to their adventures. The series explores themes of friendship, freedom, and the pursuit of dreams, while delving into the intricate history of the world, including the enigmatic Void Century and the powerful Ancient Weapons. Throughout their journey, the Straw Hat Pirates face formidable foes, including rival pirate crews, the oppressive World Government, and the mysterious Marines. Each battle reveals more about the world’s secrets and the true nature of the One Piece treasure itself. With its masterful storytelling, emotional depth, and a blend of humor and action, One Piece invites viewers to join Luffy and his crew on an unforgettable adventure filled with twists, revelations, and the enduring spirit of adventure.",
                Videos:[{
                    name:"Video1",
                    link:"one-piece-amv-welcome-to-onigashima-1080-publer.io.mp4",
                    title:"One Piece amv welcome to Onigashima",
                }]
    }]       
    })


    AnidB.save()
    .then(info=>{
        res.send(info)
    })
});
app.get("/Delete",(req,res)=>{
    AniDB.find()
    .then(info=>res.send(info))
})