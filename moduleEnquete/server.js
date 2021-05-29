let express = require('express');
const var_dump = require('var_dump')
let app = express();
let bodyParser = require('body-parser')
let session = require('express-session')
//let score = require('./views/pages/footer.ejs')

//Moteur de template
app.set('view engine', 'ejs')

//Middleware
//app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'lksdlksdl',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

app.use(require('./middlewares/flash'))

//Routes
app.get('/', (request, response) =>{
    response.render('pages/index')
})
app.post('/', (request, response) =>{

    if (request.body.commentaire === undefined || request.body.commentaire === '' ) {
        //response.render('pages/index', {error: "vous n'avez pas entrer de commentaire"})

        request.flash('error', "vous n'avez pas entrer de commentaire") 
        response.redirect('/')
    }
    else{
        let q1 = (Number)(request.body.q1)
        let q2 = (Number)(request.body.q2)
        let q3 = (Number)(request.body.q3)
        let q4 = (Number)(request.body.q4)
        let q5 = (Number)(request.body.q5)
        let q6 = (Number)(request.body.q6)
        let q7 = (Number)(request.body.q7)
        let q8 = (Number)(request.body.q8)
        let q9 = (Number)(request.body.q9)

        let score = parseFloat(q1 + q2 + q3 + q4+ q5+ q6+ q7+ q8+ q9)
        //var_dump(score)

        let Note = require('./models/note')
        Note.create(score, request.body.commentaire,  function() {
            request.flash('success', "Merci ! Votre réponse a été bien envoyé")
            response.redirect('/')
        })
    }
})

app.listen(8080)

