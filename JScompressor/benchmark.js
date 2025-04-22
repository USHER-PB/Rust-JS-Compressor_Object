const fs = require('fs');
const { compress_rle, decompress_rle } = require('./rlecompress');
const { compress_lz77, packCompressedData, decompress_lz77 } = require('./lz77compress');
const { performance } = require('perf_hooks');
const path = require('path');

class Benchmark {
  constructor() {
    this.results = [];
  }

  async runTest(inputFile, algorithm) {
    console.log(`\n🔍 Testing ${algorithm} compression on ${inputFile}`);
    
    // Read input file
    const inputData = fs.readFileSync(inputFile, 'utf8');
    const originalSize = inputData.length;
    console.log(`📊 Original size: ${originalSize} bytes`);
    console.log('Original content:', inputData);

    // Compression test
    const compressStart = performance.now();
    let compressedData;
    if (algorithm === 'rle') {
      compressedData = compress_rle(inputData);
    } else if (algorithm === 'lz77') {
      compressedData = compress_lz77(inputData);
    }
    const compressTime = performance.now() - compressStart;
    const compressedSize = compressedData.length;
    const compressionRatio = (originalSize / compressedSize).toFixed(2);

    // Decompression test
    const decompressStart = performance.now();
    let decompressedData;
    if (algorithm === 'rle') {
      decompressedData = decompress_rle(compressedData);
    } else if (algorithm === 'lz77') {
      decompressedData = decompress_lz77(compressedData);
    }
    const decompressTime = performance.now() - decompressStart;

    // Verify data integrity
    const isCorrect = decompressedData === inputData;
    console.log('Decompressed content:', decompressedData);
    console.log('Data integrity:', isCorrect ? '✅ Verified' : '❌ Failed');

    // Store results
    const result = {
      algorithm,
      inputFile,
      originalSize,
      compressedSize,
      compressionRatio,
      compressTime: compressTime.toFixed(2),
      decompressTime: decompressTime.toFixed(2),
      isCorrect
    };

    this.results.push(result);
    this.printResult(result);
  }

  printResult(result) {
    console.log(`
📈 Results for ${result.algorithm.toUpperCase()}:
----------------------------------------
Input file: ${result.inputFile}
Original size: ${result.originalSize} bytes
Compressed size: ${result.compressedSize} bytes
Compression ratio: ${result.compressionRatio}x
Compression time: ${result.compressTime}ms
Decompression time: ${result.decompressTime}ms
Data integrity: ${result.isCorrect ? '✅ Verified' : '❌ Failed'}
----------------------------------------
    `);
  }

  printSummary() {
    console.log('\n📊 Benchmark Summary');
    console.log('====================');
    this.results.forEach(result => {
      console.log(`
${result.algorithm.toUpperCase()} (${result.inputFile}):
  Compression ratio: ${result.compressionRatio}x
  Compression speed: ${(result.originalSize / result.compressTime).toFixed(2)} bytes/ms
  Decompression speed: ${(result.compressedSize / result.decompressTime).toFixed(2)} bytes/ms
      `);
    });
  }
}

// Main benchmarking function
async function runBenchmark() {
  const benchmark = new Benchmark();
  
  // Test files with correct paths
  const testFiles = [
    path.join(__dirname, 'test/small.txt'),    // Small text file
    path.join(__dirname, 'test/medium.txt'),   // Medium text file
    path.join(__dirname, 'test/large.txt'),    // Large text file
    path.join(__dirname, 'test/binary.bin')    // Binary file
  ];

  // Run tests for each file and algorithm
  for (const file of testFiles) {
    if (fs.existsSync(file)) {
      await benchmark.runTest(file, 'rle');
      await benchmark.runTest(file, 'lz77');
    } else {
      console.log(`⚠️ Test file ${file} not found, skipping...`);
    }
  }

  // Print summary
  benchmark.printSummary();
}

// Run the benchmark
runBenchmark().catch(console.error); 