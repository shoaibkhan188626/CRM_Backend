const mongoose = require("mongoose");
const Model = mongoose.model("Invoice");
const custom = require("@/controllers/middlewaresControllers/pdfController");
const { calculate } = require("@/helpers");
const { increaseBySettingKey } = require("@/middlewares/settings");
const schema = require("./schemaValidate");

const create = async (req, res) => {
  try {
    let body = req.body;

    const { error, value } = schema.validate(body);
    if (error) {
      const { details } = error;
      return res.status(400).json({
        success: false,
        result: null,
        message: details[0]?.message,
      });
    }

    const { items = [], taxRate = 0, discount = 0 } = value;
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
    body["subTotal"] = subTotal;
    body["taxTotal"] = taxTotal;
    body["total"] = total;
    body["items"] = items;

    let paymentStatus =
      calculate.sub(total, discount) === 0 ? "paid" : "unpaid";

    body["paymentStatus"] = paymentStatus;
    body["createdBy"] = req.admin._id;

    const result = await new Model(body).save();
    const fileId = "invoice-" + result._id + ".pdf";
    const updateResult = await Model.findOneAndUpdate(
      { _id: result._id },
      { pdfPath: fileId },
      { new: true }
    ).exec();
    increaseBySettingKey({ settingKey: "last_invoice_number" });
    custom.generatePdf(
      "Invoice",
      { filename: "invoice", format: "A4" },
      result
    );

    return res.status(200).json({
      success: true,
      result: updateResult,
      message: "Invoice created successfully",
    });
  } catch (error) {
    console.log(err);
    if (error.name == "ValidationError") {
      return res.status(500).json({
        success: false,
        result: null,
        error: error,
        message: error.message,
      });
    }
  }
};
module.exports = create;
