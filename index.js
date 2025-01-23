import express from 'express';
import path from 'path'
import { fileURLToPath } from 'url';

// this is called middleware: 
const app = express();

// if you are using "type":"module" then you need to do this 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// for reading json data if we don't put it we not able to read the json data
app.use(express.json());

// for reading urlencoded data if we don't use it we not able to read www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// if "type":"common"(by default) then only need to write this line
app.use(express.static(path.join(__dirname, 'public')));

// npm i ejs and then create a folter (check the name of folder it should be "views" definately);
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    console.log('middleware running');
    next();
});

app.get('/', (req, res) => {
    // res.send('hello world guys')
    res.render('index')
})
app.get('/sign-up', (req, res, next) => {
    // res.send('sign-up successfully')
    return next(new Error('something is wrong'))
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(5000);