const mongoose = require("mongoose");
const Model = mongoose.model("Payment");
const Invoice = mongoose.model("Invoice");
const custom = require("@/controllers/middlewaresControllers/pdfController");
const { calculate } = require("@/helpers");
