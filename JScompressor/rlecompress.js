function compress_rle(contents) {
  if (Buffer.isBuffer(contents)) {
    contents = contents.toString(); // Convert buffer to string
  }

  let result = [];

  let i = 0;
  while (i < contents.length) {
    let count = 1;
    while (i + 1 < contents.length && contents[i] === contents[i + 1]) {
      count++;
      i++;
    }

    result.push(contents.charCodeAt(i)); // store actual byte value
    result.push(count);                  // store count as byte
    i++;
  }

  return Buffer.from(result);
}


// console.log(compress_rle("aaabbcccc"))
function decompress_rle(contents) {
  if (!contents || !Buffer.isBuffer(contents)) {
    throw new Error('Input must be a Buffer');
  }

  let result = "";

  for (let i = 0; i < contents.length; i += 2) {
    const byte = contents[i];       // actual byte
    const count = contents[i + 1];  // how many times to repeat


    const char = String.fromCharCode(byte); // convert byte to character
    result += char.repeat(count);           // build up the result string
  }
   console.log("string version :" , result)
  return result; // return as string
}


module.exports = {
  compress_rle,
  decompress_rle
}; 