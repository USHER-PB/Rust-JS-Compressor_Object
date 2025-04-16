function compress_rle(contents) {
    let result = "";
    let i = 0;
  
    while (i < contents.length) {
      let count = 1;
      while (i + 1 < contents.length && contents[i] === contents[i + 1]) {
        count++;
        i++;
      }
  
      result += contents[i] , count;
      i++;
    }
  
    return Buffer.from(result);
  }

// console.log(compress_rle("aaabbcccc")); 
module.exports = compress_rle;


