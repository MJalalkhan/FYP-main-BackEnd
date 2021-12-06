// Define schema

import mongoose from 'mongoose';
const { Schema } = mongoose;
const product = new Schema({
	productName: {
		type: String
	},
	productID: {
		type: String
	},
	
	productImage:{
		type:String
	},

	productQuantity: {
		type: String
	},
	price: {
		type: String
	},
	storeId:{
		type: String
	},
	// discountPrice: {
	// 	type: Number
	// },
	stock: {
		type: String
	},
	productDescription: {
		type: String
	}
});

// Compile model from schema
export const cartModel = mongoose.model('CartProduct', product);
