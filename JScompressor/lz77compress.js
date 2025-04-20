function compress_lz77(input) {
  const windowSize = 4096;
  const lookaheadSize = 18;
  const output = [];
  let pos = 0;
  let tag ;

  while (pos < input.length) {
    let matchLength = 0;
    let offset = 0;

     const searchStart = Math.max(0, pos - windowSize);
    const lookaheadEnd = Math.min(pos + lookaheadSize, input.length);

    for (let searchPos = searchStart; searchPos < pos; searchPos++) {
      let length = 0;
      while (
        pos + length < lookaheadEnd &&
        input[searchPos + length] === input[pos + length]
      ) {
        length++;
      }

      if (length > matchLength) {
        matchLength = length;
        offset = pos - searchPos;
      }
    }

    if (matchLength >= 2) {
      tag = 0x01;
      const nextChar = input[pos + matchLength] || 0;
      output.push({ tag:0x01 , offset, length: matchLength, nextChar });
      pos += matchLength + 1;
    } else {
      tag = 0x00;
      output.push({ tag , nextChar: input[pos] });
      pos += 1;
    }
  }
  console.log ("the compression output is :" ,output);
  return output
  // return Buffer.from(output);
  // return Buffer.from(output.map(entry => entry.tag));
  ;
}


function packCompressedData(entries) {
    const bufferArray = [];
  
    for (const entry of entries) {
      if (entry.tag === 0x00) {
        bufferArray.push(entry.tag); // Literal
        bufferArray.push(entry.nextChar); // Next character
      }
      else if (entry.tag === 0x01) {
        bufferArray.push(entry.tag); // Match
        bufferArray.push(entry.offset)//gh byte
        bufferArray.push(entry.length); // lenght 
        bufferArray.push(entry.nextChar); // Next character
      }
      else {
        throw new Error(`Unknown tag: ${entry.tag}`);
      }
      // bufferArray.push(entry.offset >> 8);      // High byte
      // bufferArray.push(entry.tag);    // Low byte
      // bufferArray.push(entry.length);           // Match length
      // bufferArray.push(entry.nextChar ?? 0); 
      //    // Next character
    }
    return Buffer.from(bufferArray);
  }
  function decompress_lz77(buffer) {
    let result = [];
    let pos = 0;

    // If input is string (from fs.readFileSync with encoding), convert to Buffe
    console.log("Buffer (ascii):", buffer.toString('ascii'));

    while (pos < buffer.length) {
        const tag = buffer[pos];
        pos++;

        if (tag === 0x00) {
            // Literal
            const char = buffer[pos];
            pos++;
            result.push(char);
        } else if (tag === 0x01) {
            // Match
            const offset = buffer[pos];
            pos++;
            const length = buffer[pos];
            pos++;
            const nextChar = buffer[pos];
            pos++;

            const start = result.length - offset;
            for (let i = 0; i < length; i++) {
                result.push(result[start + i]);
            }
            result.push(nextChar);
        } else {
            throw new Error(`Invalid tag: ${tag}`);
        }
    }

    return Buffer.from(result);
}
// Example usage of compression and decompression 
// // Example usage:
// const compressedData = [
//     0x00, 0x61, 0x00, 0x61, 0x00, 0x61, 0x00, 0x20, 0x00, 0x75, 0x01, 0x03, 0x20, 0x00, 0x75,
//     0x00, 0x73, 0x00, 0x68, 0x00, 0x65, 0x00, 0x72, 0x00, 0x20
// ];
// const decompressedData = decompress(compressedData);
// console.log(String.fromCharCode(...decompressedData)); 
  
  module.exports = {
    compress_lz77,
    packCompressedData,
    decompress_lz77
  };
  
