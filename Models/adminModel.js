import mongoose from 'mongoose';
const { Schema } = mongoose;

const adminModelSchema = new Schema({
    firstName: {
		type: String,
		required: true
	},
    lastName: {
		type: String,
		required: true
	},
    phoneNum: {
		type: String,
	},
    role:{
        type: String,
        default:'admin'
    },
    isActive: 
    {
        type: Boolean,
        default: false
    },
      email: {
        type: String,
        // lowercase: true,
		required: true,
        unique: true,
        // sparse:true
    },
     password: {
        type: String,
        required: true
    }
});

export const adminModel = mongoose.model("Admins", adminModelSchema);

