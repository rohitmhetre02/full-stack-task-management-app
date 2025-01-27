import foodModel from "../models/foodModel.js";
import fs from 'fs';

//  add food item
const addFood = async (req, res) => {
   let image_filename = `${req.file.filename}`

   const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: image_filename,
      category: req.body.category
   })
   try {
      await food.save();
      res.json({ success: true, massage: "Food Added" })
   } catch (error) {
      console.log(error)
      res.json({ success: false, massage: "Error" })
   }
}

// all food list
const listFood = async (req, res) => {
   try {
      const foods = await foodModel.find({});
      res.json({ success: true, data: foods })
   } catch (error) {
      console.log(error)
      res.json({ success: false, massage: "errror" })
   }
}

// remove food item
const removeFood = async(req,res) => {
 try{
      const food = await foodModel.findById(req.body.id);
      fs.unlink(`imgs/${food.image}`,()=>{})

      await foodModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, data: " food removed" })
 }catch(error){
  console.log(error)
  res.json({ success: false, massage: "errror" })
 }
}

export { addFood, listFood,removeFood };