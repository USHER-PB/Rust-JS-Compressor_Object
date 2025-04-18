function compress_lz77(input) {
  const windowSize = 4096;
  const lookaheadSize = 18; // Fixed lookahead buffer size
  const output = [];
  let pos = 0;

  while (pos < input.length) {
    const end = Math.min(pos + lookaheadSize, input.length);
    let matchLength = 0;
    let offset = 0;

    const searchStart = pos >= windowSize ? pos - windowSize : 0;

    for (let searchPos = searchStart; searchPos < pos; searchPos++) {
      let length = 0;

      while (
        length < end - pos &&
        input[searchPos + length] === input[pos + length]
      ) {
        length++;
      }

      if (length > matchLength) {
        matchLength = length;
        offset = pos - searchPos;
      }
    }

    if (matchLength >= 3) {
      const nextChar = input[pos + matchLength] ?? null; // EOF-safe
      output.push({ offset, length: matchLength, nextChar });
      pos += matchLength + 1;
    } else {
      output.push({ offset: 0, length: 0, nextChar: input[pos] });
      pos += 1;
    }
  }

  return output;
}

function packCompressedData(entries) {
    const bufferArray = [];
  
    for (const entry of entries) {
      bufferArray.push(entry.offset >> 8);      // High byte
      bufferArray.push(entry.offset & 0xff);    // Low byte
      bufferArray.push(entry.length);           // Match length
      bufferArray.push(entry.nextChar ?? 0);    // Next character
    }
  
    return Buffer.from(bufferArray);
  }
  
  module.exports = {
    compress_lz77,
    packCompressedData
  };
  
