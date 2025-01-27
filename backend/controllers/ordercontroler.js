import orderModel from "../models/orderMdel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// placeing user order for frontend
const placeOrder = async(req,res) => {

    const frontend_url ="https://foodflow-ui.onrender.com";

    try{
      const newOrder = new orderModel({
        userId: req.body.userId,
        items:req.body.items,
        amount:req.body.amount,
        address:req.body.address
      })
      await newOrder.save();
      await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});


      const line_items = req.body.items.map((item)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:item.name
            },
            unit_amount:item.price*100
        },
        quantity:item.quantity
      }))
       
      line_items.push({
        price_data:{
            currency:"inr",
            product_data:{
                name:"Delivery charges"
            },
            unit_amount:25*100
        },
         quantity:1
      })

      const session = await stripe.checkout.sessions.create({
        line_items: line_items, 
        mode: "payment",
        success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      });
    
      res.json({ success: true, session_url: session.url }); 
    } catch (error) {
      console.error("Error creating Stripe session:", error.message);
      res.json({ success: false, message: "Error creating payment session" });
    }
}

const verifyOrder =async(req,res) => {
    const {orderId,success} =req.body;
    try{
      if (success=="true"){
         await orderModel.findByIdAndUpdate(orderId,{payment:true});
         res.json({success:true,message:"Paid"})

      }
      else{
        await orderModel.findByIdAndDelete(orderId);
        res.json({success:false,message:"Not Paid"})
      }
    }catch(error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//  user order for frontend
const userOrder = async (req, res) => {
  try {
      if (!req.body.userId) {
          return res.status(400).json({ success: false, message: "User ID is required" });
      }
      const orders = await orderModel.find({ userId: req.body.userId });
      res.json({ success: true, orders });
  } catch (error) {
      console.error(error);
      res.json({ success: false, message: "Error" });
  }
};

//  listing orders for admin panel
const listOrders = async (req,res) => {
   try{
      const orders = await orderModel.find({});
      res.json({success:true,data:orders})
   } catch(error){
      console.log(error);
      res.json({success:false,message:"Error"})
   }
}

// new api update orer status
const updateOrderStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.status(200).json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};


export{placeOrder,verifyOrder,userOrder,listOrders,updateOrderStatus};
