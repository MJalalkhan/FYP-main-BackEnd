import { adminModel } from '../Models/AdminModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '../Models/userModel';
import { storeModel } from '../Models/storeModel';
import sendEmail from '../Models/sendEmail';

//admin
export const signUpAdmin = async (req, res) => {
	const { name, email, password, confirmPassword } = req.body; //destrcturing req.body
	const user = await adminModel.findOne({ email });
	console.log('Admin Object', user);
	// if (user) {
	// 	return `Admin already exist with this email ${user.email} and id ${user._id}`;
	// }
	if (user) {
		res.status(401).send(`Admin already exist with this email ${user.email} and id ${user._id}`);
		return;
	}
	if (password !== confirmPassword) {
		res.status(401).send('Password didnot matched').status(400);
		return;
	}

	const saltRounds = 10;
	const hashPassword = await bcrypt.hash(password, saltRounds);
	const userObj = {
		name,
		email,
		password: hashPassword
	};

	const createUser = new adminModel(userObj);

	try {
		const response = await createUser.save();
		if (response) {
			res
				.send({
					message: 'User Signedup Successfully'
				})
				.status(200);
				return;
		}
	} catch (error) {
		res
			.send({
				message: 'Something went wrong'
			})
			.status(500);
		return false;
	}
};

export const signInAdmin = async (req, res) => {
	const { email, password } = req.body; //destrcturing req.body
	const user = await adminModel.findOne({ email: email });
	console.log('admin obj', user);
	if (!user) {
		res.status(401).send({Error:'Email does not exist'});
		return;
	}
	if (!await bcrypt.compare(password, user.password)) {
		res.status(401).send({Error:'Password is Incorrect'});
		return;
	}
	try {
		const token = jwt.sign({ user_id: user._id, email,role:'admin' }, process.env.TOKEN_KEY, {
			expiresIn: '2h'
		});

		res
			.cookie('access_token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production'
			})
			.status(200)
			.send({ message: `LoggedIn Successfully with token \n ${token}`, status: 200, token: token });
	} catch (error) {
		return false;
	}
};

//==================displayAllAdmins=============
export const displayAllAdmins = async (req, res) => {
	// const { name, email } = req.body; //destrcturing req.body
	try {
		const response = await adminModel.find();
		if (response) {
			res
				.send({
					message: 'All Admins displayed Successfully',
					response
				})
				.status(200);
		}
	} catch (error) {
		res
			.send({
				message: 'Something went wrong'
			})
			.status(500);
		return false;
	}
	// const response = await AllUsersDisplayAuth(name, email);
	// const user = await findAll();
};

//==================displayAllUsers=============
export const displayAllUsers = async (req, res) => {
	// const { name, email } = req.body; //destrcturing req.body
	try {
		const response = await userModel.find();
		if (response) {
			res
				.send({
					message: 'All users displayed Successfully',
					response
				})
				.status(200);
		}
	} catch (error) {
		res
			.send({
				message: 'Something went wrong'
			})
			.status(500);
		return false;
	}
	// const response = await AllUsersDisplayAuth(name, email);
	// const user = await findAll();
};

//=================DisplayAllSellers=========
export const displayAllSellers = async (req, res) => {
	// const { name, email } = req.body; //destrcturing req.body
	try {
		const response = await storeModel.find();
		if (response) {
			res
				.send({
					message: 'All Sellers displayed Successfully',
					response
				})
				.status(200);
		}
	} catch (error) {
		res
			.send({
				message: 'Something went wrong'
			})
			.status(500);
		return false;
	}
	// const response = await AllUsersDisplayAuth(name, email);
	// const user = await findAll();
};

//==============DisplayUserDataInProfile=======
export const displayAdminDataInProfile = async (req, res) => {
	const id  = '61a62d8539d450df41ec1f27';
	
	try {
		const response = await adminModel.findOne({ _id: id });
		if (response) {
			res
				.send({
					message: 'Admin displayed Successfully',
					response
				})
				.status(200);
		} else {
			res.send({
				message: 'Admin not found with this id'
			});
			return;
		}
	} catch (error) {
		res
			.send({
				message: 'Something went wrong'
			})
			.status(500);
		return false;
	}
};


//==================UpdateAdminProfile==========
export const updateAdminProfileData = async (req, res) => {
	 	const id = '61a62d8539d450df41ec1f27'
		 const {firstName,lastName,phoneNum,oldPassword,newPassword,confirmPassword}=req.body
		 console.log("req body",req.body);
		 const admin = await adminModel.findOne({_id:id});
		 console.log('Admin--',admin);
		 
		 if (!await bcrypt.compare(oldPassword, admin.password)) {
			 res.status(401).send({Error:'OldPassword is Incorrect'});
			 return;
		 }
	 
		 if (newPassword !== confirmPassword) {
			 res.status(401).send({Error:'New Password didnot match to confirm password'});
			 return;
		 }
		 const saltRounds = 10;
		 const hashPassword = await bcrypt.hash(newPassword, saltRounds);
		 
		const itemUpdateObj = {
			firstName,
			lastName,
			phoneNum,
			password: hashPassword

		};
		console.log(itemUpdateObj);
		try {
			const response = await adminModel.findByIdAndUpdate({_id:id}, itemUpdateObj);
			console.log('hhhhh',response);
			if (response) {
				res
					.send({ message: `Updated Successfully\n`, status: 200 })
					.status(200);
			}
		} catch (error) {
			res
				.send({
					message: 'Something went wrong'
				})
				.status(500);
			return false;
		}
	};

export const AdminForgetPassword = async (req, res) => {
  
	const { email,password} = req.body; //destrcturing req.body
	
	const user = await adminModel.findOne({ email: email });

	if (!user) {
		res.status(401).send({ Error: 'Email is not registered with us'});
		return;
	}
	const saltRounds = 10;
	const hashPassword = await bcrypt.hash(password, saltRounds);
	const itemUpdateObj = {
		password: hashPassword
	};

	try {	
		const response = await adminModel.findOneAndUpdate({email}, itemUpdateObj);
		console.log(response);
		if (response) {
			// var text = 'visit http://localhost:3001/UserSignIn';
			sendEmail('muhammad.bsse3549@iiu.edu.pk',email,`Reset OnliteShop Password`,`Your New password for Admin account ${email} is :${password}, Kindly change your password after Login`);   
			res
			.send({ message: `New password Sent on email\n`, status: 200 })
			.status(200);
		}
	} catch (error) {
		console.log(error);
		res
			.send({
				 Error: 'Something went wrong'
			})
			.status(500);
		return false;
	}
   
};
