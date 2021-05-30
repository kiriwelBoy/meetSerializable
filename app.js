const express =require('express'),
morgan  = require('morgan'),
nodemailer = require('nodemailer'),
smtpTransport = require('nodemailer-smtp-transport'),
app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(morgan("dev"))

app.set('views',__dirname+'/views')
app.set('view engine', 'html')


app.get('/', function(req,res){
    res.send('wassupppp')
})


app.get('/contact', function(req,res,next){

    let options = {
        host: 'smtp.gmail.com',
        port: 465,
        secureConnection: true,
        transportMethod: "SMTP",
        auth: {
            user: 'mohamedndao1@esp.sn',
            pass: '771687153'
        }
    }

    let mailOptions ={
        from:  "mohamedndao1@esp.sn",
        to:  "emmanueldiatta@esp.sn",
        subject: "Formulaire d'enquete",
        text: "un truc"
    }

    let transporter = nodemailer.createTransport(smtpTransport(options))

    transporter.sendMail(mailOptions, (error, info) =>{
        if (error) {
            console.error("thieuz amneu "+error.message)
        } else {
            console.log("mochollah "+info.response)
        }
})

})

app.listen(3000)
console.log('App is runnig')