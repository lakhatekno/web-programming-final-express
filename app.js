const express = require('express');
const app = new express();
const port = 5000;
const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nwind'
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'pug');
const session = require('express-session');
app.use(session({secret: 'yntkts'}));

app.get('/', (req, res) => {
    conn.connect(err => {
        conn.query('select * from categories', (err, result, field) => {
            res.render('home', {kategori: result});
        });
    });
});

app.get('/products/:id', (req, res) => {
    const id = req.params.id;
    conn.connect(err => {
        conn.query(`select * from products where CategoryID=${id}`, (err, result, field) => {
            res.render('products', {produk: result});
        });
    });
});

app.get('/detail/:id', (req, res) => {
    const id = req.params.id;
    const sql = `select * from products inner join categories where products.CategoryID=categories.CategoryID and products.ProductID=${id}`;
    conn.connect(err => {
        conn.query(sql, (err, result, field) => {
            res.render('detail', {data: result[0]});
            console.log(result);
        });
    });
});

app.post('/cart', (req, res) => {
    const item = {
        name: req.body.name,
        price: req.body.price,
        qty: req.body.qty
    };
    
    if(!req.session.cart) {
        req.session.cart = [];
    }
    
    req.session.cart.push(item);
    res.render('cart', {items: req.session.cart});
});

app.get('/kill', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(port, () => {
    console.log('server started ^^');
})