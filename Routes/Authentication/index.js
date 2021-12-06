import express from 'express';
// import * as authController from '../../Controllers/authController';
import * as adminController from '../../Controllers/adminController'
import * as userController from '../../Controllers/userController'
import * as storeController from '../../Controllers/storeController'
import  {verifyToken} from '../../middleware/auth'

const router = express.Router();
//=====================user=================
router.post('/signup', userController.signup);
router.post('/signIn', userController.signIn);
router.post('/checkout',verifyToken, userController.checkout);
router.post('/updateUserStatus/:id',verifyToken,userController.updateUserStatus);
router.get('/displayUserDataInProfile',verifyToken, userController.displayUserDataInProfile);
router.post('/updateUserProfileData', verifyToken, userController.updateUserProfileData);


//====================admin=================
router.post("/AdminSignup", adminController.signUpAdmin);
router.post("/AdminSignin", adminController.signInAdmin);


router.delete('/deleteUser/:id', verifyToken,userController.deleteUser);
router.delete('/deleteSeller/:id', verifyToken,storeController.deleteSeller);
router.get('/displayAllAdmins',verifyToken,adminController.displayAllAdmins);
router.get('/displayAllUsers',verifyToken,adminController.displayAllUsers);
router.get('/displayAllSellers',verifyToken,adminController.displayAllSellers);
router.get('/displaySingleUser/:id',verifyToken, userController.displaySingleUser);

router.get('/displayAdminDataInProfile', adminController.displayAdminDataInProfile);
router.post('/updateAdminProfileData', adminController.updateAdminProfileData);

//====================Seller=================
router.post("/sellerSignup",storeController.sellerSignup);
router.post("/sellerSignin", storeController.sellerSignIn);
router.post('/updateSellerStatus/:id',verifyToken,storeController.updateSellerStatus);


router.post("/AddProduct",verifyToken, storeController.AddProducts);
router.delete("/deleteProduct/:id",verifyToken, storeController.DeleteProduct);

router.post("/getAllProducts", storeController.getAllProducts);
router.post("/getSingleProduct/:id", storeController.GetSingleProduct);
router.get('/displayAllOrders',verifyToken,storeController.displayAllOrders);
router.post("/getStoreProducts/",verifyToken, storeController.getStoreProducts);
router.post("/displaySingleCustomer/:id",verifyToken, storeController.displaySingleCustomer);

router.get('/displayVendorDataInProfile', storeController.displayVendorDataInProfile);
router.post('/updateVendorProfileData', storeController.updateVendorProfileData);

//=====================Cart==================
router.post("/AddToCart",verifyToken, storeController.AddToCart);
router.delete("/DeleteFromCart/:id", storeController.DeleteFromCart);
// router.post("/UpdateCart/:id", verifyToken,storeController.UpdateCart);
router.post("/displayAllItems", storeController.displayAllItems);
router.post("/placeOrder",verifyToken, storeController.placeOrder);


//==================Forgetpassword==============
router.post("/UserForgetPassword",userController.UserForgetPassword);
router.post("/VendorForgetPassword",storeController.VendorForgetPassword);
router.post("/AdminForgetPassword",adminController.AdminForgetPassword);


export default router;
