const mongoose = require("mongoose");
const Model = mongoose.model("Offer");
const custom = require("@/controllers/middlewaresControllers/pdfController");
const { calculate } = require("@/helpers");
const { increaseBySettingKey } = require("@/middlewares/settings");

const create = async (req, res) => {
  try {
    const { items = [], taxRate = 0 } = req.body;
    let subTotal = 0;
    let taxTotal = 0;
    let total = 0;
    items.map((item) => {
      let total = calculate.multiply(item["quantity"], item["price"]);
      subTotal = calculate.add(subTotal, total);
      item["total"] = total;
    });

    taxTotal = calculate.multiply(subTotal, taxRate);
    total = calculate.add(subTotal, taxTotal);
    let body = req.body;
    body["subTotal"] = subTotal;
    body["taxTotal"] = taxTotal;
    body["total"] = total;
    body["items"] = items;
    body["createdBy"] = req.admin._id;

    const result = await new Model(body).save();
    const fileId = "offer-" + result._id + ".pdf";
    const updateResult = await Model.findOneAndUpdate(
      { _id: result._id },
      { pdfPath: fileId },
      { new: true }
    ).exec();

    increaseBySettingKey({ settingKey: "last_offer_number" });
    custom.generatePdf("Offer", { filename: "offer", format: "A4" }, result);

    return res.status(200).json({
      success: true,
      result: updateResult,
      message: "Offer created successfully",
    });
  } catch (error) {
    if (error.name == "ValidationError") {
      return res.status(400).json({
        success: false,
        result: null,
        message: "Required fields are not supplied",
      });
    } else {
      return res.status(500).json({
        success: false,
        result: null,
        message: error.message,
      });
    }
  }
};

module.exports = create;
