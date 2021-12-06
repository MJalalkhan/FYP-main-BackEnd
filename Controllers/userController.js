import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { storeOrderModel } from "../Models/store-ordersModel";
import { cartModel } from "../Models/CartModel";
import { userModel } from "../Models/userModel";
import sendEmail from "../Models/sendEmail";
import { adminModel } from "../Models/AdminModel";
import { storeModel } from "../Models/storeModel";

export const signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body; //destrcturing req.body

  const user = await userModel.findOne({ email: email });

  console.log("User Object", user);
  if (user) {
    res.status(401).send(`User already exist with this email ${user.email}`);
    return;
  }
  if (password !== confirmPassword) {
    res.status(401).send("Password didnot matched");
    return;
  }
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);
  const userObj = {
    name,
    email,
    password: hashPassword,
  };

  // const response = await create(userObj);
  const createUser = new userModel(userObj);
  try {
    const response = await createUser.save();

    if (response) {
      res
        .send({
          message: "User Signedup Successfully",
        })
        .status(200);
      return;
    }
  } catch (error) {
    res
      .send({
        message: "Something went wrong",
      })
      .status(500);
    return false;
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body; //destrcturing req.body

  const user = await userModel.findOne({ email: email });

  if (!user) {
    res.status(401).send({ Error: "Email does not exist" });
    return;
  }
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(401).send({ Error: "Password is Incorrect" });
    return;
  }
  try {
    const token = jwt.sign(
      { user_id: user._id, email, role: "user" },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .send({
        message: `LoggedIn Successfully with token \n ${token}`,
        status: 200,
        token: token,
      });
  } catch (error) {
    res
      .send({
        message: "Something went wrong",
      })
      .status(500);
    return false;
  }
};

//=================CheckOut===========
export const checkout = async (req, res) => {
  const body = req.body; //destrcturing req.body
  const id =req.user.user_id;
  const Obj = {
    totalBill: body.totalBill,
    customer: {
      firstName: body.firstName,
      lastName: body.lastName,
      userName: body.userName,
      email: body.email,
      address: body.address,
      mobile: body.mobile,
      country: body.country,
      province: body.province,
      zip: body.zip,
    }, 
    productlist: await cartModel.find(),
  };
  console.log('productlist',Obj.productlist);
  //save order details in db
  const result = new storeOrderModel(Obj);
  //clearing cart
  await cartModel.deleteMany();
  // console.log("resss", result);
  try {
    const response = await result.save();
    if (response) {
      res
        .send({ message: `CheckOut Done Successfully \n`, status: 200 })
        .status(200);
    }
  } catch (error) {
    res
      .send({
        message: "Something went wrong",
      })
      .status(500);
    return false;
  }
};

//===============isDisable state==========
export const updateUserStatus = async (req, res) => {
  console.log('Request',req.body);
  const id=req.params.id
  const { isDisable } = req.body;

  try {
    const response = await userModel.findByIdAndUpdate( id , {$set:{isDisable:isDisable}},{new: true} );
    console.log('res',response);
    if (response) {
      res
        .send({
          message: "data Updated Successfully",
        })
        .status(200);
    }
  } catch (error) {
    console.log("error",error);
    res
      .send({
        message: "Something went wrong",
      })
      .status(500);
    return false;
  }
};

//==============DisplayUserDataInProfile=======
export const displayUserDataInProfile = async (req, res) => {
  // console.log('here',req);
  const id = req.user.user_id;

  // console.log(req.user);
  try {
    let response;
    if (req.user.role === "user") {
      response = await userModel.findOne({ _id: id });
    }
    if (req.user.role === "admin") {
      response = await adminModel.findOne({ _id: id });
    }
    if (req.user.role === "vendor") {
      response = await storeModel.findOne({ _id: id });
    }

    console.log("ress", response);
    if (response) {
      res
        .send({
          message: `${req.user.role} displayed Successfully`,
          response,
        })
        .status(200);
    } else {
      res.send({
        message: `${req.user.role} not found with this id`,
      });
      return;
    }
  } catch (error) {
    res
      .send({
        message: "Something went wrong",
      })
      .status(500);
    return false;
  }
};

//==================UpdateUserProfile==========
export const updateUserProfileData = async (req, res) => {
  const id = req.user.user_id;
  const {firstName,lastName,phoneNum,oldPassword,newPassword,confirmPassword,} = req.body;
  const { storeName,
    storeType,
    storeLocation,
    email,
    mobile,
    // address,
    city,
    // province,
    country,
    cnicNo,
    // cnicName,
    bankName,
    branchCode,
    accountTitle,
    accountNo } =req.body;
  //  const user = await userModel.findOne({_id:id});
  let response;
  if (req.user.role === "user") {
    response = await userModel.findById(id);
  }
  if (req.user.role === "admin") {
    response = await adminModel.findById(id);
  }
  if (req.user.role === "vendor") {
    response = await storeModel.findById(id);
  }
  console.log('response',response);

  if (!(await bcrypt.compare(oldPassword, response.password))) {
    res.status(401).send({ Error: "OldPassword is Incorrect" });
    return;
  }

  if (newPassword !== confirmPassword) {
    res
      .status(401)
      .send({ Error: "New Password didnot match to confirm password" });
    return;
  }
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(newPassword, saltRounds);
  let updateObj;
  if (req.user.role === "user" || req.user.role === "admin") {
    updateObj = {
      firstName,
      lastName,
      phoneNum,
      password: hashPassword,
    };
  }
  if (req.user.role === "vendor") {
    updateObj = {
		storeName,
        storeType,
        storeLocation,
        mobile,
        // address,
        city,
        // province,
        country,
        // cnicName,
        bankName,
        branchCode,
        accountTitle,
        accountNo ,
      	password: hashPassword,
    };
  }

  try {
	  let response;
	  if (req.user.role === "user") {
		response = await userModel.findByIdAndUpdate(id, updateObj);
	  }
	  if (req.user.role === "admin") {
		response = await adminModel.findByIdAndUpdate(id, updateObj);
	  }
	  if (req.user.role === "vendor") {
		response = await storeModel.findByIdAndUpdate(id, updateObj);
	  }
    console.log("hhhhh", response);

    if (response) {
      res.send({ message: `${req.user.role} Updated Successfully\n`, status: 200 }).status(200);
    }
  } catch (error) {
    res
      .send({
        message: "Something went wrong",
      })
      .status(500);
    return false;
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params; //destrcturing req.body
console.log('idddd',id);
  const user = await userModel.findById(id);
  if (!user) {
    res.send("user not found with this id");
    return;
  }

  try {
    const response = await userModel.findOneAndDelete({ _id: id });
    if (response) {
      res
        .send({
          message: "User Deleted Successfully",
        })
        .status(200);
    }
  } catch (error) {
    res
      .send({
        message: "Something went wrong",
      })
      .status(500);
    return false;
  }
};

export const displaySingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await userModel.findOne({ _id: id });
    if (response) {
      res
        .send({
          message: "user displayed Successfully",
          response,
        })
        .status(200);
    } else {
      res.send({
        message: "User not found with this id",
      });
      return;
    }
  } catch (error) {
    res
      .send({
        message: "Something went wrong",
      })
      .status(500);
    return false;
  }
};

export const UserForgetPassword = async (req, res) => {
  const { email, password } = req.body; //destrcturing req.body

  const user = await userModel.findOne({ email: email });

  if (!user) {
    res.status(401).send({ Error: "Email is not registered with us" });
    return;
  }
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);
  const itemUpdateObj = {
    password: hashPassword,
  };

  try {
    const response = await userModel.findOneAndUpdate({ email }, itemUpdateObj);
    console.log(response);
    if (response) {
      // var text = 'visit http://localhost:3001/UserSignIn';
      sendEmail(
        "muhammad.bsse3549@iiu.edu.pk",
        email,
        `Reset OnliteShop Password`,
        `Your New password for User account ${email} is :${password}, Kindly change your password after Login.`
      );
      res
        .send({ message: `New password Sent on email\n`, status: 200 })
        .status(200);
    }
  } catch (error) {
    console.log(error);
    res
      .send({
        Error: "Something went wrong",
      })
      .status(500);
    return false;
  }
};
