const fs = require("fs");
const rle = require("/rle");
const lz77 = require("/lz77");
const path = require("path");



    const filepath = process.argv[3];
    try {
    const contents = fs.readFileSync(filepath);

}catch(err){
    console.error("file is empty and cannot be read", err.message);
}

const compress =  compress(contents);

console.log("compression was succesful");
console.log (compress);