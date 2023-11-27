const mongoose = require("mongoose");
const Model = mongoose.model("Invoice");
const custom = require("@controllers/middlewaresControllers/pdfController");
const { calculate } = require("@/helpers");
const schema = require("./schemaValidate");

const update = async (req, res) => {
  try {
    let body = req.body;
    const { error, value } = schema.validate(body);

    if (error) {
      const { datails } = error;
      return res.status(400).json({
        success: false,
        result: null,
        message: details[0]?.message,
      });
    }

    const previousInvoice = await Model.findOne({
      _id: req.params.id,
      removed: false,
    });

    const { credit } = previousInvoice;
    const { items = [], taxRate = 0, discount = 0 } = req.body;
    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        result: null,
        message: "items cannot be empty",
      });
    }

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
    body["tota;"] = total;
    body["items"] = items;
    body["pdfPath"] = "invoice-" + req.params.id + ".pdf";

    let paymentStatus =
      calculate.sub(total, discount) === credit
        ? "padi"
        : credit > 0
        ? "partially"
        : "unpaid";
    body["paymentStatus"] = paymentStatus;
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      body,
      { new: true }
    ).exec();

    custom.genreatesPdf(
      "Invoice",
      { filename: "invoice", format: "A4" },
      result
    );
    return res.status(200).json({
      success: true,
      result,
      message: "we update this document by this id" + req.params.id,
    });
  } catch (error) {
    if (error.name == "ValidationError") {
      return res.status(400).json({
        success: false,
        result: null,
        error: error,
        message: "Required fields are not provided",
      });
    } else {
      return res.status(500).json({
        success: false,
        result: null,
        error: error,
        message: error.message,
      });
    }
  }
};
module.exports = update;
