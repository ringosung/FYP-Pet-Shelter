const fs = require('fs');
const path = require('path');
const stripe = require('stripe')('sk_test_51KxXkFDpSxXDL5wY7GA5RdhNlUlkH8TgMFhLqUS67LPEqpUR69jguFrDtlINFWmKVZCoqxz9zE83pOo7jj1e3Y8G00FI1NXFBW');

const PDFDocument = require('pdfkit');



const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');

const ITEMS_PER_PAGE = 4;



exports.getProducts = async(req, res) => {
  const page = +req.query.page || 1;
  let totalItems;
  let query = Product.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.species != null && req.query.species != '') {
    query = query.regex('species', new RegExp(req.query.species, 'i'))
  }
  if (req.query.breed != null && req.query.breed != '') {
    query = query.regex('breed', new RegExp(req.query.breed, 'i'))
  }
  if (req.query.personality != null && req.query.personality != '') {
    query = query.regex('personality', new RegExp(req.query.personality, 'i'))
  }


  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    
    try{
        const products = await query.exec()
        res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        searchOptions: req.query
      });
    }
     catch {
      (err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
     
    });
}};

exports.getFinderProducts = async(req, res) => {
  const page = +req.query.page || 1;
  let totalItems;
  let query = Product.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.species != null && req.query.species != '') {
    query = query.regex('species', new RegExp(req.query.species, 'i'))
  }
  if (req.query.breed != null && req.query.breed != '') {
    query = query.regex('breed', new RegExp(req.query.breed, 'i'))
  }
  if (req.query.personality != null && req.query.personality != '') {
    query = query.regex('personality', new RegExp(req.query.personality, 'i'))
  }


  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    
    try{
        const products = await query.exec()
        res.render('shop/pet-finder-product-list', {
        prods: products,
        pageTitle: 'Pets',
        path: '/Pet Finder',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        searchOptions: req.query
      });
    }
     catch {
      (err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
     
    });
}};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.getCart = (req, res, next) => {

  if (req.user.role === 'admin') {
    
      let cartUserArray = []
      User.find({}, async function(error, cartUser){
        if (error) {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        } 
      
        
        cartUser.map(function(u){
        if(u.cart.items.length > 0 ){
          
          u
          .populate('cart.items.productId')
          .execPopulate()
          if(JSON.stringify(u.cart.items[0].approve) === "false"){
            cartUserArray.push(u)
          }
          
          console.log("cartUserArray " + cartUserArray);
          
              
        } return cartUserArray;  
        })
      
       setTimeout(function(){
        
        function flatten(arr){
          var flat = [];
          for (var i = 0; i< arr.length; i++){
            flat = flat.concat(arr[i].cart.items);
          }
          return flat;
        }

        const products = flatten(cartUserArray)
        
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products,
          users:cartUserArray
        });
       }, 100)
      
      
      })

}


  else if (req.user.role === 'user') {
    console.log(req.user);
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      console.log(user.cart.items);
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
      
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  }

};


exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProductAdmin = async (req, res, next) => {
  const prodId = req.body.productId;
  const userId = req.body.userId;
  let resultObj = {};
  console.log(userId)
  await User.findById(userId, function (err, result){
    console.log("findById" + result);
    resultObj = result;
  })
  console.log("resultObj " + resultObj);
  resultObj
  .removeFromCartAdmin(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
    Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
  }

  exports.getApproveAdoption = (req, res, next) => {

    const userId = req.params.userId;
    const prodId = req.params.adoptionId;
    console.log("userId " + userId + " prodId " + prodId);
    User.findById(userId).then(user => {
      user.cart.items[0].approve = true;
      console.log(user.cart.items[0].productId)
      console.log(user.cart.items[0].approve)
      user.save().then(result => {
        res.redirect('/cart');
      })
    })


  };
  
  exports.postApproveAdoption = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedSpecies = req.body.species;
    const updatedBreed = req.body.breed;
    const updatedGender = req.body.gender;
    const updatedPersonality = req.body.personality;
    const updatedbirthday = req.body.birthday;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDesc = req.body.description;
    
  
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        hasError: true,
        product: {
          title: updatedTitle,
          species: updatedSpecies,
          breed: updatedBreed,
          gender: updatedGender,
          personality: updatedPersonality,
          birthday: updatedbirthday,
          price: updatedPrice,
          description: updatedDesc,
          _id: prodId
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
    }
  }

exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      products = user.cart.items;
      total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(p => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: p.productId.price * 100,
            currency: 'hkd',
            quantity: p.quantity
          };
        }),
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });
    })
    .then(session => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total,
        sessionId: session.id
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        Product.findById(i.productId).then(product => {
          product.adoption = true;
          product.save();
        })
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'Certificate-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Certificate', {
        underline: true
      });
      pdfDoc.text('-----------------------');
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(18)
          .text('This is a certifiate to prove that you are the owner of ' +
            prod.product.title
          );
      });
      pdfDoc.text('------------------------');
      pdfDoc.fontSize(14).text('And adoption fee: $' + totalPrice + ' has been paid');

      pdfDoc.end();

    })
    .catch(err => next(err));
};

exports.getTraining = (req, res, next) => {
  
      res.render('shop/training', {
        pageTitle: 'Pet Training',
        path: '/training',
       
      });
    }

    exports.getSupport = (req, res, next) => {
  
      res.render('shop/support', {
        pageTitle: 'Adoption Support',
        path: '/support',
       
      });
    }




    exports.petFinder = async(req, res) => {
      const page = +req.query.page || 1;
      let totalItems;
      let query = Product.find()
      if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
      }
      if (req.query.species != null && req.query.species != '') {
        query = query.regex('species', new RegExp(req.query.species, 'i'))
      }
      if (req.query.breed != null && req.query.breed != '') {
        query = query.regex('breed', new RegExp(req.query.breed, 'i'))
      }
    
    
      Product.find()
        .countDocuments()
        .then(numProducts => {
          totalItems = numProducts;
          
          return Product.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
        })
        
        try{
            const products = await query.exec()
            res.render('shop/pet-finder', {
            prods: products,
            pageTitle: 'Pet Finder',
            path: '/pet-finder',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            searchOptions: req.query
          });
        }
         catch {
          (err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
         
        });
    }};