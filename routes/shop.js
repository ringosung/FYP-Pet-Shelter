const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/finderproducts', shopController.getFinderProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/cart-delete-item-admin', isAuth, shopController.postCartDeleteProductAdmin);

router.post('/cart-approve-item-admin', isAuth, shopController.postApproveAdoption);

router.get('/cart-approve-item-admin/:adoptionId/:userId', isAuth, shopController.getApproveAdoption);

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/checkout/success', shopController.getCheckoutSuccess);

router.get('/checkout/cancel', shopController.getCheckout);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

router.get('/training', shopController.getTraining);

router.get('/adoption-support', shopController.getSupport);

router.get('/pet-finder', shopController.petFinder);

// router.post('/approve/:productId', isAuth, shopController.postApprove)

module.exports = router;

// router.post(
//     '/approve',
//     [
//       body('approve')
//     ],
//     isAuth,
//     adminController.postEditProduct
//   );
