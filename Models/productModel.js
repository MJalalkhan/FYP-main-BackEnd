import mongoose from 'mongoose';
const { Schema } = mongoose;

const product = new Schema({

    productName: {
        type: String
    },
    isActive: 
    {
        type: Boolean,
        default: true
    },
    productImage:{
        type:String
    },

    price:{
        type: String
    },
    discountPrice:{
        type: Number
    },
    stock: {
        type: String
    },
    storeId:{
        type: Schema.Types.ObjectId,
        ref: 'Store'
    },
    productDescription: {
        type: String
    },
    // Store:{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Store'
    // } 
});


export const productModel = mongoose.model("Product", product);