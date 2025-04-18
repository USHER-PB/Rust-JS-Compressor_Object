const fs = require("fs");
const { compress_rle, decompress_rle } = require("./rlecompress");
const { compress_lz77, packCompressedData  } = require("./lz77compress");

const [mode, inputPath, outputPath, conversion_style] = process.argv.slice(2);

// Check if input file exists
if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input file '${inputPath}' does not exist`);
  process.exit(1);
}

console.log(`Reading file: ${inputPath}`);
const contents = fs.readFileSync(inputPath);
console.log(`Input file size: ${contents.length} bytes`);
console.log(`Input content (first 100 bytes):`, contents.slice(0, 100).toString('utf8'));

let result;

if (conversion_style === "--rle") {
  console.log(`Using RLE ${mode}ion`);
  try {
    result = mode === "compress" ? compress_rle(contents) : decompress_rle(contents);
    console.log(`Result size: ${result.length} bytes`);
  } catch (error) {
    console.error(`Error during ${mode}ion:`, error.message);
    process.exit(1);
  }
} else if (conversion_style === "--lz") {
  console.log("LZ77 method used for conversion");
  try {
    if (mode === "compress") {
      result = compress_lz77(contents);
    } else {
      result = decompress_lz77(contents);
    }
    console.log(`Result size: ${result.length} bytes`);
  } catch (error) {
    console.error(`Error during ${mode}ion:`, error.message);
    process.exit(1);
  }
} else {
  console.error("Invalid conversion_style");
  process.exit(1);
}

// Verify result is not empty
if (!result || result.length === 0) {
  console.error("Error: Result is empty");
  process.exit(1);
}

console.log(`Writing to file: ${outputPath}`);
try {
  fs.writeFileSync(outputPath, result);
  
  // Verify the file was written
  if (!fs.existsSync(outputPath)) {
    console.error("Error: Output file was not created");
    process.exit(1);
  }
  
  // Read back the file to verify content
  const writtenContent = fs.readFileSync(outputPath);
  console.log(`Written file size: ${writtenContent.length} bytes`);
  console.log(`Written content (hex):`, writtenContent.toString('hex').slice(0, 100));
  
  console.log(`✅ ${mode}ion complete! Output saved to ${outputPath}`);
} catch (error) {
  console.error(`Error writing to file: ${error.message}`);
  process.exit(1);
}

// Only show decompressed content if we're decompressing
if (mode === "decompress") {
  const decompressed = decompress_rle(contents);
  console.log("Decompressed:", decompressed.toString());
}
