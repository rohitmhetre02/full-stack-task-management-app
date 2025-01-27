import express from "express";
import { addFood , listFood,removeFood} from "../controllers/foodcontroler.js";
import multer from "multer";

const foodRouter = express.Router();

// image storege engine
const storege = multer.diskStorage({
    destination:"imgs",
    filename:(req,file,cb)=>{
     return cb(null,`${Date.now()} ${file.originalname}`)
    }
})

const upload = multer({storage:storege})

foodRouter.post("/add",upload.single("image"),addFood)
foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood);

export default foodRouter;