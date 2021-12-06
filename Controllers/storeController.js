import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { storeModel } from "../Models/storeModel";
import { cartModel } from "../Models/CartModel";
import { storeOrderModel } from "../Models/store-ordersModel";
import { productModel } from "../Models/productModel";
import sendEmail from "../Models/sendEmail";

//======================Seller==========================
export const sellerSignup = async (req, res) => {
  // const { name, email, password, confirmPassword } = req.body; //destrcturing req.body
  const body = req.body;
  console.log(req.body);
  const { password, confirmPassword } = body;

  const cnic = {
    cnic: {
      cnicNo: body.cnicNo,
      // cnicName: body.cnicName
    },
  };
  console.log(cnic);

  const user = await storeModel.findOne(cnic);
  if (user) {
    res
      .status(401)
      .send({
        message: `Store already exist with this cnic ${cnic.cnic.cnicNo} `,
      })
    return;
  }
  if (password !== confirmPassword) {
    res.status(401).send({message:"Password didnot matched"}).status(400);
    return;
  }
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);
  const final = {
    storeName: body.storeName,
    storeType: body.storeType,
    storeLocation: body.storeLocation,
    email: body.email,
    password: hashPassword,
    mobile: body.mobile,

    address: {
      address: body.address,
      city: body.city,
      province: body.province,
      country: body.country,
    },
    cnic: {
      cnicNo: body.cnicNo,
      cnicName: body.cnicName,
    },
    bank: {
      bankName: body.bankName,
      branchCode: body.branchCode,
      accountTitle: body.accountTitle,
      accountNo: body.accountNo,
    },
  };

  const createUser = new storeModel(final);
  try {
    const response = await createUser.save();
    if (response) {
      res
        .send({
          message: "Store registered Successfully.SignIn now..",
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

//==================SignIn============
export const sellerSignIn = async (req, res) => {
  const { email, password } = req.body; //destrcturing req.body
  const user = await storeModel.findOne({ email });
  console.log(user);

  if (!user) {
    console.log("emial");
    res.status(401).send({ Error: "Email does not exist" });
    return;
  }
  if (!(await bcrypt.compare(password, user.password))) {
    console.log("pass");
    res.status(401).send({ Error: "Password is Incorrect" });
    return;
  }
  try {
    const token = jwt.sign(
      { user_id: user._id, email, role: "vendor" },
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

//===============isDisable state==========
export const updateSellerStatus = async (req, res) => {
  console.log('Request',req.body);
  const id=req.params.id
  const { isDisable } = req.body;

  try {
    const response = await storeModel.findByIdAndUpdate( id , {$set:{isDisable:isDisable}},{new: true} );
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

// //=================DisplayAllSellers=========
// export const displayAllSellers = async (req, res) => {
// 	const { name, email } = req.body; //destrcturing req.body
// 	try {
// 		const response = await storeModel.find();
// 		if (response) {
// 			res
// 				.send({
// 					message: 'All Sellers displayed Successfully',
// 					response
// 				})
// 				.status(200);
// 		}
// 	} catch (error) {
// 		res
// 			.send({
// 				message: 'Something went wrong'
// 			})
// 			.status(500);
// 		return false;
// 	}
// 	// const response = await AllUsersDisplayAuth(name, email);
// 	// const user = await findAll();
// };

//============DeleteSeller===========
export const deleteSeller = async (req, res) => {
  const { id } = req.params; //destrcturing req.body

  const user = await storeModel.findById(id);
  if (!user) {
    res.send("Seller not found with this id");
    return;
  }

  try {
    const response = await storeModel.findByIdAndDelete( id );
    if (response) {
      res
        .send({
          message: "Seller Deleted Successfully",
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

//=================AddProducts=========
export const AddProducts = async (req, res) => {
  const body = req.body;

  const AddObj = {
    productName: body.productName,
    productImage: body.productImage,
    price: body.price,
    discountPrice: body.discountPrice,
    stock: body.stock,
    storeId: req.user.user_id,
    productDescription: body.productDescription,
  };

  const result = new productModel(AddObj);
  try {
    const response = await result.save();
    // console.log("response", response);
    if (response) {
      res
        .send({ message: `Product Added Successfully\n`, status: 200 })
        .status(200);
    }
  } catch (error) {
    console.log("error", error);
    res
      .send({
        message: "Something went wrong",
      })
      .status(500);
    return false;
  }
};

//==================DeleteProduct============
export const DeleteProduct = async (req, res) => {
	const { id } = req.params; //destrcturing req.body
	const item = await productModel.findById({ _id: id });
	if (!item) {
	  res
		.send({
		  message: "Item not found with this id",
		})
		.status(200);
	  return;
	} else {
	  try {
		const response = await productModel.findOneAndDelete(id);
		if (response) {
		  res
			.send({
			  message: "Data Deleted Successfully",
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
	}
  };



//=================GetAllProducts========
export const getAllProducts = async (req, res) => {
  // const { product } = req.body; //destrcturing req.body
  // const id = req.user.user_id;
  try {
    const response = await productModel.find();
    // const response = await storeModel.findById(id).populate('storeId');

    if (response) {
      res.send(response).status(200);
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

//=================GetAllStoreProducts========
export const getStoreProducts = async (req, res) => {
  //   const { storeId } = req.params;
  //   console.log(req.params);
  const storeId = req.user.user_id;
  const response = await productModel.find({ storeId });
  // console.log("Store Products Object", response);
  if (!response) {
    res.send(`Store is empty`);
    return;
  }
  try {
    if (response) {
      res.send(response).status(200);
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
//===================GetSingleProduct=====
export const GetSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await productModel.findOne({ _id: id });
    if (response) {
      res
        .send({
          message: "product displayed Successfully",
          response,
        })
        .status(200);
    } else {
      res.send({
        message: "product not found with this id",
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


//=================DisplayAllOrders=======
export const displayAllOrders = async (req, res) => {
  const storeId=req.user.user_id;
  console.log(storeId,req.user);
//   console.log(req.user.user_id);
let response
let arr=[]
if(req.user.role==='vendor'){
  const storeId=req.user.user_id
  
  response = await storeOrderModel.find();
  response.forEach(obj => {
    obj.productlist.forEach(product => {
			if(product.storeId==storeId){
					arr.push(product)
			}
		});
  });
	// console.log("arrr",arr);
		response.productlist=arr
}
if(req.user.role==='admin'){
	response = await storeOrderModel.find();
	console.log('Admin Response',response);
}
  try {

    if (response) {
      res
        .send({
          message: "All Orders displayed Successfully",
          response,
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

//CART
//==================AddToCart============
export const AddToCart = async (req, res) => {
  const body = req.body;
  console.log('reqqq body', body);
  const { productID } = body;
  // const response = await AddToCartAuth(final);
  // const item = await findOne( {productID:final.productID});
  const item = await cartModel.findOne({ productID });
  console.log("Cart Object", item);
  if (item) {
    res.send(`Data Already Exist in cart`);
    return;
  }
  const cartObj = {
    productName: body.productName,
    productImage: body.productImage,
    productQuantity: body.productQuantity,
    productID: body.productID,
    price: body.price,
	storeId:body.storeId,
    // discountPrice: body.discountPrice,
    // stock: body.stock,
    productDescription: body.productDescription,
  };

  const result = new cartModel(cartObj);
  console.log("Data Added", result);
  try {
    const response = await result.save();
    if (response) {
      res
        .send({
          message: "data added Successfully",
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

//==================DeleteFromCart============
export const DeleteFromCart = async (req, res) => {
  const { id } = req.params; //destrcturing req.body
  console.log(id);
  const item = await cartModel.findById({ _id: id });
  if (!item) {
    res
      .send({
        message: "Item not found with this id",
      })
      .status(200);
    return;
  } else {
    try {
      const response = await cartModel.findOneAndDelete(id);
      if (response) {
        res
          .send({
            message: "data Deleted Successfully",
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
  }
};

//==================UpdateCart============
// export const UpdateCart = async (req, res) => {
//   const { id } = req.params;
//   const { productName, price } = req.body; //destrcturing req.body'

//   // const response = await UpdateCartAuth(id, productName, price);
//   const item = await cartModel.findById(id);
//   console.log(item);
//   if (!item) {
//     res.send("Item not found with this id");
//     return;
//   }

//   const itemUpdateObj = {
//     productName: productName,
//     price: price,
//   };
//   // console.log('uppppppp', { _id: id }, itemUpdateObj);
//   // const response = await UpdateItemCart({ _id: id }, itemUpdateObj);
//   // const response = await cartModel.findByIdAndUpdate({ _id: id }, itemUpdateObj);
//   // console.log('Sucessfully Updated ');
//   try {
//     const response = await cartModel.findByIdAndUpdate(
//       { _id: id },
//       itemUpdateObj
//     );
//     if (response) {
//       res
//         .send({
//           message: "data Updated Successfully",
//         })
//         .status(200);
//     }
//   } catch (error) {
//     res
//       .send({
//         message: "Something went wrong",
//       })
//       .status(500);
//     return false;
//   }
// };

//==================displayAllItems============
export const displayAllItems = async (req, res) => {
	
  try {
    const response = await cartModel.find();
    if (response) {
      res
        .send({
          message: ` All items displayed Successfully ${response.length}`,

          response,
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

//===================GetSingleProduct=====
export const displaySingleCustomer = async (req, res) => {
  const { id } = req.params;
  const storeId=req.user.user_id;
  console.log(storeId);
  try {
    const orderedItems = await storeOrderModel.findOne({ _id: id });
	let arr=[]
		orderedItems.productlist.forEach(product => {
			// console.log("product===",product);
			if(product.storeId==storeId){
					arr.push(product)
			}
		});
		orderedItems.productlist=arr
	console.log("array",arr);
	// console.log('OrderedItems',OrderedItems);
    if (orderedItems) {
      res
        .send({
          message: "user displayed Successfully",
          response: orderedItems,
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

// *****************************  PLace Order *****************************
export const placeOrder = async (req, res) => {
  try {
    const final = {
      
      customer: {
        email: body.cemail,
        name: body.cname,
        address: body.caddress,
        mobile: body.cmobile,
      },
	//   storeId:storeId.value;
    };
    // const { email,name,address,mobile } = req.body; //destrcturing req.body
    console.log("final", final);
    const newOrder = new storeOrderModel(final);
    await newOrder.save();
    const id = newOrder._id;
    console.log("new id", id);

    await storeOrderModel.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          productlist: {
            product: body.p_id,
            quantity: body.pquantity,
            productTotal: body.pquantity,
          },
        },
      }
    );
    const store = await storeModel.findOne({ email: body.shopMail });
    const result = store.orders.push(newOrder);
    storeModel.save();
    if (result) {
      res.send("successfully Placed Order");
      return;
    }
  } catch (error) {
    res
      .send({
        message: "Something went wrong",
        error,
      })
      .status(500);
    return false;
  }
};

//==============DisplayVendorDataInProfile=======
export const displayVendorDataInProfile = async (req, res) => {
//   const id = "61a62d8539d450df41ec1f27";

  try {
    const response = await storeModel.findOne({ _id: id });
    if (response) {
      res
        .send({
          message: "Vendor displayed Successfully",
          response,
        })
        .status(200);
    } else {
      res.send({
        message: "Vendor not found with this id",
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

//==================UpdateVendorProfile==========
export const updateVendorProfileData = async (req, res) => {
  const id = req.user.user_id;
  const {
    storeName,
    storeType,
    storeLocation,
    email,
    oldPassword,
    newPassword,
    confirmPassword,
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
    accountNo,
  } = req.body;
  console.log("req body", req.body);
  const vendor = await storeModel.findOne({ _id: id });
  console.log("Vendor--", vendor);

  if (!(await bcrypt.compare(oldPassword, vendor.password))) {
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

  const itemUpdateObj = {
    firstName,
    lastName,
    phoneNum,
    password: hashPassword,
  };
  console.log(itemUpdateObj);
  try {
    const response = await storeModel.findByIdAndUpdate(
      { _id: id },
      itemUpdateObj
    );
    console.log("hhhhh", response);
    if (response) {
      res.send({ message: `Updated Successfully\n`, status: 200 }).status(200);
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

export const VendorForgetPassword = async (req, res) => {
  const { email, password } = req.body; //destrcturing req.body

  const user = await storeModel.findOne({ email: email });

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
    const response = await storeModel.findOneAndUpdate(
      { email },
      itemUpdateObj
    );
    console.log(response);
    if (response) {
      // var text = 'visit http://localhost:3001/UserSignIn';
      sendEmail(
        "muhammad.bsse3549@iiu.edu.pk",
        email,
        `Reset OnliteShop Password`,
        `Your New password for Vendor account ${email} is :${password}, Kindly change your password after Login `
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
