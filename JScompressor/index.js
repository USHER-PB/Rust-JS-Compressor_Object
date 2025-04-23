#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { compress_rle, decompress_rle } = require("./rlecompress");
const { compress_lz77, packCompressedData, decompress_lz77 } = require("./lz77compress");

const [,, mode, ...rest] = process.argv;

const method = rest.includes("--rle") ? "--rle" : rest.includes("--lz") ? "--lz" : null;
const methodIndex = rest.findIndex(arg => arg === "--rle" || arg === "--lz");

if (!method || methodIndex === -1) {
    console.error(" Please specify --rle or --lz");
    process.exit(1);
}

const files = rest.slice(0, methodIndex);
const outputPath = rest[methodIndex + 1]; // Assume output path is right after --rle or --lz

if (!["compress", "decompress"].includes(mode)) {
    console.error(" Mode must be 'compress' or 'decompress'");
    process.exit(1);
}
if (!outputPath) {
    console.error(" Please specify output file name after the compression method");
    process.exit(1);
}

let finalBuffer;

try {
    if (mode === "compress") {
        const results = [];

        for (const inputPath of files) {
            if (!fs.existsSync(inputPath)) {
                console.error(` File not found: ${inputPath}`);
                continue;
            }

            const contents = fs.readFileSync(inputPath);

            let compressed;
            if (method === "--rle") {
                compressed = compress_rle(contents);
            } else {
                const temp = compress_lz77(contents);
                compressed = packCompressedData(temp);
            }

            results.push(compressed);
            console.log(` Compressed: ${inputPath} (${compressed.length} bytes)`);
        }

        // Combine all into a single Buffer
        finalBuffer = Buffer.concat(results);
        fs.writeFileSync(outputPath, finalBuffer);
        console.log(` All compressed outputs written to ${outputPath}`);

    } else if (mode === "decompress") {
        const inputPath = files[0];
        if (!fs.existsSync(inputPath)) {
            console.error(` Input file not found: ${inputPath}`);
            process.exit(1);
        }

        const contents = fs.readFileSync(inputPath);
        let result;

        if (method === "--rle") {
            result = decompress_rle(contents);
        } else {
            result = decompress_lz77(contents);
        }

        fs.writeFileSync(outputPath, result);
        console.log(` Decompressed output written to ${outputPath}`);
    }
} catch (err) {
    console.error(" Error:", err.message);
    process.exit(1);
}
