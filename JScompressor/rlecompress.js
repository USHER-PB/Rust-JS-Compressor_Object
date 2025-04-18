function compress_rle(contents) {
    // Convert buffer to string if it's a buffer
    let result = "";
    let i = 0;
  
    while (i < contents.length) {
      let count = 1;
      while (i + 1 < contents .length && contents [i] === contents [i + 1]) {
        count++;
        i++;
      }
  
      result += contents [i];
      result += count;
      i++;
    }
  
    return Buffer.from(result);
}

// console.log(compress_rle("aaabbcccc"))
function decompress_rle(contents ) {
  // contents  validation
  if (!contents  || !Buffer.isBuffer(contents )) {
    throw new Error('contents  must be a valid Buffer');
  }

  // Convert buffer to string
  const compressedString = contents.toString('utf8');
  console.log('Decompression input:', compressedString);
  
  let decompressedResult = '';
  let currentChar = '';
  let currentCount = '';

  // Process each character
  for (let i = 0; i < compressedString.length; i++) {
    const char = compressedString[i];
    
    if (/\d/.test(char)) {
      // If it's a digit, add it to the count
      currentCount += char;
    } else {
      // If we have a previous character and count, process them
      if (currentChar && currentCount) {
        const count = parseInt(currentCount, 10);
        if (count > 0 && count <= 1000) {
          decompressedResult += currentChar.repeat(count);
        }
      }
      // Start new character
      currentChar = char;
      currentCount = '';
    }
  }

  // Handle the last character and count
  if (currentChar && currentCount) {
    const count = parseInt(currentCount, 10);
    if (count > 0 && count <= 1000) {
      decompressedResult += currentChar.repeat(count);
    }
  }

  if (decompressedResult.length === 0) {
    throw new Error('Decompression resulted in empty string');
  }

  console.log('Decompression output:', decompressedResult);
  return decompressedResult;
}

module.exports = {
  compress_rle,
  decompress_rle
}; 