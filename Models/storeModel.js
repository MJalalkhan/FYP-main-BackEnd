import mongoose from 'mongoose';
const { Schema } = mongoose;

const Store = new Schema({
    role:{
        type: String,
        default:'vendor'
    },
    isDisable: 
    {
        type: Boolean,
        default: false
    },
    storeName: {
        type: String
    },
    storeType: {
        type: String
    },
    storeLocation:{
        type: String
    },
    email: {
        type: String,
        unique: true,
        sparse:true
    },
    password: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        address: { type: String},
        city: {type: String},
        province: {type: String},
        country: {type: String}
    },
    cnic:{
        cnicNo:{type: String,unique: true},
        cnicName:{type: String}
    },
    bank:{
        bankName:{type: String},
        branchCode:{type: String},
        accountTitle:{type: String},
        accountNo:{type: String,unique:true},
    },
    products:[{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    orders:[{
        type: Schema.Types.ObjectId,
        ref: 'StoreOrder'
    }]


});


export const storeModel = mongoose.model("Store", Store);