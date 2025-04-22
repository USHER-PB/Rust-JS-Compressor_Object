const assert = require('assert');
const { compress_lz77, packCompressedData, decompress_lz77 } = require("../lz77compress");

describe('LZ Compression', () => {
    it('should compress and decompress correctly', () => {
        const input = Buffer.from('ABABABABABAB');
        const compressed = compress_lz77(input);
        const packedCompressed = packCompressedData(compressed);
        const decompressed = decompress_lz77(packedCompressed);
        assert.strictEqual(decompressed.toString(), input.toString());
    });
});
