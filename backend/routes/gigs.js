const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../models/Gig');
const Product = require('../models/Product');
const User = require('../models/User');
const {le, ls, lfe, lfs, la, li, cl } = require('../util/log');


router.get('/deleteProductFromCart/productId/:id', (req, res, next)=> {
    const id = req.params.id;  
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({where: {id: id}})
        })
        .then(products => {
            cl(la(products));
            const product = products[0];
            if(product) {
                return product.cartItem.destroy().then(deleteResult => {
                    res.status(200).send({
                        name: product.title,
                        action: 'removed from Cart'
                    })
                });
            } else {
                res.status(200).send({
                    action: 'removing product from Cart',
                    result: 'There is not such a product inside Cart'
                })
            }
        })
        .catch(err => {
            res.sendStatus(401);
            cl(lfe(err));
        })
} );


router.get('/addProductToCart/productId/:id', (req, res, next)=> {
    const id = req.params.id;   
    let userCart;
    req.user
    .getCart()
    .then(cart => {
        userCart = cart;
        //because in app always we make a cart for each user Always we have cart
        return cart.getProducts({where: {id: id}});
    })
    .then(products => {
        if(products.length > 0) { //if cart is not empty
            const product = products[0];
            const oldQuantity = product.cartItem.quantity;
            const newQuantity = oldQuantity + 1;
            userCart.addProduct(product, {through: {quantity: newQuantity}})
                .then(result => {
                    res.status(200).send({
                        name: product.title,
                        action: 'Added to cart with new quantity of ' +  newQuantity
                    })
                });
        }else { //if cart is empty
            //todo: adding product with quantity of 1
            Product.findByPk(id)
                .then(product => {
                    userCart.addProduct(product, {through: {quantity: 1}});
                    res.status(200).send({
                        name: product.title,
                        action: 'Added to cart with quantity One'
                    })
                })
        }
        
    })
    .catch(err => {
        cl(lfe("Error When adding product to cart"));
        cl(la(err));
        res.sendStatus(401);
    })
} );


router.get('/find/id/:id', (req, res, next)=> {
    const id = req.params.id;   
    //find a product that is made by req.user and has id: id
    req.user.getProducts({where: {id: id}}) //return Array
    // Product.findByPk(id)
    // Product.findAll({ //always send ARRAY
    //     where: {id: id}
    // })
    .then(product => {
        cl(li('Preduct Fetched'));
        return res.status(200).send(product[0]);
    })
    .catch(err => {
        cl(lfe('Preduct NOT Fetched'));
        cl(err);
        res.sendStatus(401); 
    });
} );


router.get('/findAll', (req, res, next)=> {   
    //find all user product
    req.user.getProducts()
    //Create Product
    // Product.findAll()
    .then(products => {
        cl(li('Preduct Fetched'));
        return res.status(200).send(products);
    })
    .catch(err => {
        cl(lfe('Preduct NOT Fetched'));
        cl(err);
        res.sendStatus(401); 
    });
} );

router.get('/create-product', (req, res, next)=> {   
    //Create Product by user added to req
    req.user.createProduct({
        title: 'Don Kishot',
        price: 49,
        imageUrl: 'https://images.penguinrandomhouse.com/cover/9781101003831',
        description: 'A sad joke'
    })
    .then(result => {
        cl(li('Preduct Created'));
        // cl(result);
    })
    .catch(err => {
        cl(lfe('Preduct NOT Created'));
        cl(err); 
    });
    Product.findAll()   
        .then(products => {
            console.log(products);
        })
        .catch(err => {
            console.log(err);
        });
    res.sendStatus(200);
} )

// Sync 
router.get('/sync-force', (req, res, next)=> {
    // Product
    Product.sync({force: true})
        .then(result => {
            cl(lfs('Synced'));
            cl(li(result));
        })
        .catch(err => {
            cl(lfe('Not Synced!'));
            cl(le(err));
        });
    Product.findAll()   
        .then(users => {
            console.log(users);
        })
        .catch(err => {
            console.log(err);
        });


    // Gig
    Gig.sync({force: true})
        .then(result => {
            cl(lfs('Synced'));
            cl(li(result));
        })
        .catch(err => {
            cl(lfe('Not Synced!'));
            cl(le(err));
        });
    Gig.findAll()   
        .then(gigs => {
            console.log(gigs);
        })
        .catch(err => {
            console.log(err);
        });
    
    //User
    User.sync({force: true})
        .then(result => {
            cl(lfs('User Synced'));
            cl(li(result));
        })
        .catch(err => {
            cl(lfe('User Not Synced!'));
            cl(le(err));
        });
    User.findAll()   
        .then(users => {
            console.log(users);
        })
        .catch(err => {
            console.log(err);
        });
    res.sendStatus(200);
} );

module.exports = router;