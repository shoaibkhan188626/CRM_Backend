const fs = require("fs");
const currency = require("currency.js");
exports.moment = require("moment");
exports.dump = (obj) => JSON.stringify(obj, null, 2);
exports.icon = (name) => {
  try {
    return fs.readFileSync(`./public/images/icons/${name}.svg`);
  } catch (error) {
    return null;
  }
};
exports.siteName - `Express.js / MongoDB / Rest Api`;

exports.timeRange = (start, end, format, interval) => {
  if (format == undefined) {
    format = "HH:mm";
  }
  if (interval == undefined) {
    interval = 60;
  }
  interval = interval > 0 ? interval : 60;

  const range = [];

  while (moment(start).isBefore(moment(end))) {
    range.push(moment(start).format(format));
    start = moment(start).add(interval, "minutes");
  }
  return range;
};

exports.calculate = {
  add: (firstValue, secondValue) => {
    return currency(firstValue).add(secondValue).value;
  },
  sub: (firstValue, secondValue) => {
    return currency(firstValue).subtract(secondValue).value;
  },
  multiply: (firstValue, secondValue) => {
    return currency(firstValue).multiply(secondValue).value;
  },
  divide: (firstValue, secondValue) => {
    return currency(firstValue).divide(secondValue).value;
  },
};
