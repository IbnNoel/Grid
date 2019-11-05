let gzipAll = require("gzip-all");

console.log("Compressing Files - Started");

gzipAll("./dist/wubs-refunds/*.js");
gzipAll("./dist/wubs-refunds/*.css");

console.log("Compressing Files - Successfully completed");
