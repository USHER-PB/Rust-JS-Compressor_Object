const assert = require('assert');
const { compress_rle, decompress_rle } = require("../rlecompress");

describe('RLE Compression', () => {
    it('should compress and decompress correctly', () => {
        const input = Buffer.from('AAABBBCCCCCDDDDE');
        const compressed = compress_rle(input);
        const decompressed = decompress_rle(compressed);
        assert.strictEqual(decompressed.toString(), input.toString());
    });
});
