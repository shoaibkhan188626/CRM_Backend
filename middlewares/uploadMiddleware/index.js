const createMultipleUpload = require("./createMultipleUpload");
const uploadMultipleToStorage = require("./uploadMultipleToStorage");
const createSingleUpload = require("./createSingleUpload");
const uploadSingleToStorage = require("./uploadSingleToStorage");
const singleStorageUpload = require("./singleStorageUpload");
const setFilePathToBody = require("./setFilePathToBody");

module.exports = {
  createMultipleUpload,
  uploadMultipleToStorage,
  createSingleUpload,
  uploadSingleToStorage,
  singleStorageUpload,
  setFilePathToBody,
};
