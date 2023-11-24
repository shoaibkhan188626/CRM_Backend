const fs = require("fs");
const path = require("path");
const custom = require("@/controllers/middlewaresControllers/pdfController");
const { SendInvoice } = require("@/emailTemplate/SendInvoice");
const mongoose = require("mongoose");
const InvoiceModel = mongoose.model("Invoice");
const ClientModel = mongoose.model("Client");
const ObjectId = mongoose.Types.ObjectId;
const { Resend } = require("resend");

const sendMail = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    throw { name: "ValidationError" };
  }
  try {
    const result = await InvoiceModel.findById(ObjectId(id)).exec();
    if (!result) {
      throw { name: "ValidationError" };
    }
    const { client } = result;
    const { email, managerName } = await ClientModel.findById(client).exec();
    await custom
      .generatePdf(
        "inovice",
        { filename: "invoice", format: "A4" },
        result,
        async (fileLocation) => {
          const { id: mailId } = await sendViaApi(
            email,
            managerName,
            fileLocation
          );
          if (mailId) {
            InvoiceModel.findByIdAndUpdate(id, { status: "sent" })
              .exec()
              .then((data) => {
                return res.status(200).json({
                  success: true,
                  result: mailId,
                  message: `Successfully sent invoice ${id} to ${email}`,
                });
              });
          }
        }
      )
      .catch((error) => {
        return res.status(500).json({
          success: false,
          result: null,
          error: error,
          message: error.message,
        });
      });
  } catch (error) {
    if (error.name == "ValidationError") {
      return res.status(400).json({
        success: false,
        result: null,
        error: error,
        message: "Required fields are not supplied",
      });
    } else if (error.name == "BSONTypeError") {
      return res.status(400).json({
        success: false,
        result: null,
        error: error,
        message: "Invalid ID",
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

const sendViaApi = async (email, name, filePath) => {
  const absolutePath = path.normalize(filePath);
  const resend = new Resend(process.env.RESEND_API);
  const attatchedFile = fs.readFileSync(absolutePath);
  const data = await resend.emails.send({
    from: "shoaibullakhan15@gmail.com",
    to: email,
    subject: "Invoice From idurar",
    attachments: [{ filename: "Invoice.pdf", content: attatchedFile }],
    html: SendInvoice({ name }),
  });
  return data;
};

module.exports = sendMail;
