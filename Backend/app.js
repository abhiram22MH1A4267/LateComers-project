const express = require("express");
const bodyParser = require("body-parser");
var mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const nodemailer = require("nodemailer");



const app = express();


const urlSting = "mongodb+srv://Saichandu:Saichandu%402004@latecomersproject.1tg21.mongodb.net/";

mongoose.connect(urlSting, {
    useNewUrlParser: true,   
    useUnifiedTopology: true, 
}); 
const db = mongoose.connection;
db.once("open",function(){
    console.log("DB connected successfully")
})

app.use(bodyParser.json());
app.use(cors());


var visitorRouter = require('./routes/visitorRouter');
var studentRouter = require("./routes/studentsRouter");
var facultyRouter = require("./routes/facultyRouter");
var studentDataBaseRouter = require("./routes/studentDataBaseRouter")
var dashboardRouter = require('./routes/dashboardRouter')
var facultyDataBaseRouter = require('./routes/facultyDataBaseRouter')
var messageRouter = require('./routes/messageRouter');
var loginRouter = require('./routes/loginRoute')

app.use('/api' , visitorRouter);
app.use('/api' , studentRouter);
app.use('/api' , facultyRouter)
app.use('/api', studentDataBaseRouter)
app.use('/api', dashboardRouter)
app.use('/api' , facultyDataBaseRouter)
app.use('/api', messageRouter);
app.use('/api', loginRouter);


const port = 5000;
app.listen(port , function(){
  console.log('Server is Running at  '+'http://localhost:'+ port);
})



app.get("/", function(req,res){
  res.send("Server is Running successfully");
});


let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
      user: 'saichanduadapa951@gmail.com',
      pass: 'cicd jklm fsmr plwr',
  }
});

const mails= ["sirigiriramanjaneyulu7@gmail.com" , "sivakumarponugupati844@gmail.com" , "shaikabdullahshaik768@gmail.com" , "korramuralimohannayak@gmail.com"
]
const autoMails = (req, res) => {
  console.log("Mail is Sending ....");
  
  const mailOptions = {
      from: "saichanduadapa951@gmail.com",
      to: "sirigiriramanjaneyulu7@gmail.com",
      // to : "sivakumarponugupati844@gmail.com",
      subject: "This is a Testing Mail",
      text: "Hello Mr. Ramanjanuyulu, this mail is for testing purposes."
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log("Error: ", error);
      }
      console.log("Mail Sent Successfully: %s", info.messageId);
  });
};


// cron.schedule('* * * * *' , autoMails);

module.exports = app;