use criterion::{black_box, criterion_group, criterion_main, Criterion};
use std::fs;
use std::path::Path;
use rustcompress_rle::{compress, decompress};

fn bench_compression(c: &mut Criterion) {
    let test_files = [
        "test/small.txt",
        "test/medium.txt",
        "test/large.txt",
        "test/binary.bin"
    ];

    for file in test_files.iter() {
        let path = Path::new(file);
        if !path.exists() {
            println!("Test file {} not found, skipping...", file);
            continue;
        }

        let contents = fs::read_to_string(path).unwrap_or_else(|_| {
            fs::read(path).unwrap().iter().map(|&b| b as char).collect()
        });

        let mut group = c.benchmark_group(format!("Compression - {}", file));
        group.sample_size(10);
        group.measurement_time(std::time::Duration::from_secs(10));

        group.bench_function("RLE", |b| {
            b.iter(|| compress(black_box(&contents)))
        });

        group.finish();
    }
}

fn bench_decompression(c: &mut Criterion) {
    let test_files = [
        "test/small.txt",
        "test/medium.txt",
        "test/large.txt",
        "test/binary.bin"
    ];

    for file in test_files.iter() {
        let path = Path::new(file);
        if !path.exists() {
            println!("Test file {} not found, skipping...", file);
            continue;
        }

        let contents = fs::read_to_string(path).unwrap_or_else(|_| {
            fs::read(path).unwrap().iter().map(|&b| b as char).collect()
        });

        let compressed = compress(&contents);

        let mut group = c.benchmark_group(format!("Decompression - {}", file));
        group.sample_size(10);
        group.measurement_time(std::time::Duration::from_secs(10));

        group.bench_function("RLE", |b| {
            b.iter(|| decompress(black_box(&compressed)))
        });

        group.finish();
    }
}

criterion_group!(benches, bench_compression, bench_decompression);
criterion_main!(benches); 