# Compression Tool

A high-performance compression tool implemented in both Rust and JavaScript, supporting Run-Length Encoding (RLE) and Simplified LZ77 compression algorithms.

##  Features

- **Dual Language Implementation**
  - Rust for high-performance compression
  - JavaScript 
- **Multiple Compression Algorithms**
  - Run-Length Encoding (RLE)
  - Simplified LZ77
- **Docker Support**
  - Pre-built Docker images available
  - Easy deployment and usage
- **Comprehensive Testing**
  - Unit tests for both implementations
  - Performance benchmarking
- **CLI Interface**
  - Simple command-line usage
  - Support for compression and decompression

##  Installation

### Rust Implementation
```bash
# Clone the repository
git clone https://github.com/your-username/compression-project.git
cd compression-project/rustcompress_rle

# Build using Cargo
cargo build --release

# Or use Docker
docker build -t rustcompress_rle .
```

### JavaScript Implementation
```bash
cd compression-project/JScompressor

# Install dependencies
npm install

# Or use Docker
docker build -t jscompressor .
```

##  Usage

### Rust CLI
```bash
# Compress a file using RLE
./target/release/rustcompress_rle compress input.txt output.txt.rle

# Decompress a file
./target/release/rustcompress_rle decompress input.txt.rle output.txt

# Using Docker
docker run --rm -v $(pwd):/data rustcompress_rle compress /data/input.txt /data/output.txt.rle
```

### JavaScript CLI
```bash
# Compress a file
node index.js compress input.txt output.txt --rle  # if you want to compress using RLE 

OR 
node index.js compress input.txt output.txt --lz  # if you want to compress using lz77

# Decompress a file
node index.js decompress input.txt output.txt --rle  # if you want to decompress using RLE 

OR 

node index.js decompress input.txt output.txt --lz  # if you want to decompress using lz77

# Using Docker
docker run --rm -v $(pwd):/data JScompressor compress /data/input.txt /data/output.txt.rle
```

## Testing

### Rust Tests
```bash
cd rustcompress_rle OR cd rustcompressor_lz77 # depending on the test you want to run.
cargo test
```

### JavaScript Tests
```bash
cd JScompressor
npm test
```

## Benchmarking

Run benchmarks to compare performance:

```bash
# Rust benchmarks
cd rustcompress_rle
cargo bench

# JavaScript benchmarks
cd JScompressor
node benchmark.js
```

##  Docker Images

Docker images are available on GitHub Container Registry:

```bash
# Pull Rust_RLE implementation
docker pull ghcr.io/usher-pb/rustcompress_rle

# Pull JavaScript implementation
docker pull ghcr.io/usher-pb/JScompressor

# Pull Rust_LZ77 implementation
docker pull ghcr.io/usher-pb/rustcompressor_lz77

```
##  Development

### Prerequisites
- Rust (latest stable)
- Node.js (LTS)
- Docker
- Git

### Building from Source

1. Clone the repository
2. Build Rust implementation:
   ```bash
   cd rustcompress_rle
   cargo build --release
   ```
     ```bash
   cd rustcompressor_lz77
   cargo build --release
   ```

3. Build JavaScript implementation:
   ```bash
   cd JScompressor
   npm install
   ```

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  Resources

- [Run-Length Encoding (RLE)](https://medium.com/@ishifoev/run-length-encoding-rle-algorithm-step-by-step-guide-b0b89f3a4a9f)
- [LZ77 Compression](https://medium.com/@vincentcorbee/lz77-compression-in-javascript-cd2583d2a8bd)
- [Rust Documentation](https://doc.rust-lang.org/book/)
- [Node.js Documentation](https://nodejs.org/en/docs/) 