var express = require('express')
var app = express()
var mongoose = require('mongoose')
var bp = require('body-parser')
var path = require('path')
var session = require('express-session')
var port = 8000

app.use(express.static(path.join(__dirname, './views')))
app.use(bp.json())
app.use(bp.urlencoded())
app.use(session({secret:'key', saveUninitialized:true}))
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs')
mongoose.connect('mongodb://localhost/quotes');
mongoose.Promise = global.Promise
var QuoteSchema = new mongoose.Schema({
    name: String,
    quote: String
},{timestamps: true})
mongoose.model('Quote', QuoteSchema)
var Quote = mongoose.model('Quote')
app.get('/', function(req, res){
    res.render('index')
})
app.post('/addquote', function(req,res){
    var quote = new Quote(req.body)
    quote.save(function(err){
        if(err){
            res.render('index', {errors: user.errors})
        }
        else{
            res.redirect('/quotes')
        }
    })
})
app.get('/quotes', function(req,res){
    Quote.find({}, function(err, foundQuote){
        res.render('quotes', {quotes: foundQuote})
    })
})
app.get('/quotes/:id', function(req,res){
    Quote.findById(req.params.id,function(err,foundQuote) {
        res.render('show', {quotes: foundQuote})
    })
})
app.get('/quotes/edit/:id', function(req,res){
    Quote.findById(req.params.id,function(err,foundQuote) {
        res.render('edit', {quotes: foundQuote})
    })
})
app.post('/quotes/:id', function(req,res){
    Quote.findById(req.params.id,function(err,foundQuote) {
        if (req.body.name){
            foundQuote.name = req.body.name
        }
        if(req.body.quote){
            foundQuote.quote = req.body.quote
        }
        foundQuote.save(function(err){
            if(err){
                res.render('edit', {errors: user.errors})
            }
            else{
                res.redirect('/quotes')
            }
        })
    })
})
app.get('/quotes/destroy/:id', function(req,res){
        Quote.remove({_id: req.params.id}, function(err){
            if(err){
                console.log("Something went wrong")
            }
        res.redirect('/quotes')
        })
})
app.listen(port)