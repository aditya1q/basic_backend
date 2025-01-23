import express from 'express';
import path from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs'

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
    // console.log('middleware running');
    next();
});

app.get('/', (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        // console.log(files)
        // console.log('error occuring while reading file folder')
        res.render('index', { files: files });
    })
});

// dynamic routing 
app.get(`/profile/:name`, (req, res) => {
    const name = req.params.name;
    res.send(`i'm ${name}`)
})

app.get('/sign-up', (req, res, next) => {
    // res.send('sign-up successfully')
    return next(new Error('something is wrong'))
})

// route for submit the form

app.post('/submit', (req, res) => {
    // console.log(req.body);
    const data = fs.writeFile(`./files/${req.body.name.split(' ').join('')}`, req.body.details, (err) => {
        console.log(err, 'something went wrong');
        res.redirect('/')
        // console.log(data);
        res.send(data);
    })
})

app.get('/files/:name', (req, res) => {
    // console.log(req.body);
    fs.readFile(`./files/${req.params.name}`, 'utf-8', (err, fileData) => {
        console.log(err, 'something went wrong');
        // console.log(fileData)
        res.render('readfile', { filename: req.params.name, fileData: fileData });
    })
})


// edit files here
app.get('/edit/:name', (req, res) => {
    fs.readFile(`./files/${req.params.name}`, 'utf-8', (err, fileData) => {
        console.log(fileData)
        res.render('edit', { previousName: req.params.name, previousFileData: fileData });
    })
})

app.post('/update', (req, res) => {
    console.log(req.body);
    fs.writeFile(`./files/${req.body.new_name.split(' ').join('')}`, req.body.new_details, (err) => {
        console.log(err, 'something went wrong');
        res.redirect('/')
        // console.log(data);
        // res.send(data);
    })
})


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(5000);