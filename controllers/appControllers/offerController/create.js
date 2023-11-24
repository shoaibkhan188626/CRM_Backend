const mongoose = require("mongoose");
const Model = mongoose.model("Offer");
const custom = require("@/controllers/middlewaresControllers/pdfController");
const { calculate } = require("@/helpers");
const { increaseBySettingKey } = require("@/middlewares/settings");

const create=async(req,res)=>{
    try {
        const{items=[],taxRate=0}=req.body
    } catch (error) {
        
    }
}
