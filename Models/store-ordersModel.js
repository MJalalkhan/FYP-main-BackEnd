import mongoose from 'mongoose';
const { Schema } = mongoose;

export const storeOrder = new Schema({

    orderID: {
        type: String
    },
    date: {
         type: Date, default: Date.now
     },
    productlist: [{
        productName: String,
        productID: String,
        productImage:String,
        productQuantity:String,
        price:String,
        discountPrice:String,
        stock:String,
        productDescription:String,
        storeId:String
        }
    ],
    storeId:{
        type: String,
    },
    totalBill:{
        type: String,

    },
    customer: {
        firstName:  {type: String},
        lastName: {type: String},
        userName: {type: String},
        email: {type: String},
        address: {type: String},
        mobile: {type: String},
        country: {type: String},
        province: {type: String},
        zip: {type: String}
    } 
    ,
    // status: {
    //     type: String,
    //     default: 'Pending'
    // }
});

export const storeOrderModel = mongoose.model("StoreOrder", storeOrder);