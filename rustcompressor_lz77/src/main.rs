use std::{env, fs};
use rustcompressor_lz77::{compress_lz77, decompress_lz77};

fn main() {
    let args: Vec<String> = env::args().collect();
    let choice = &args[1];
    let input_path = &args[2];
    let output_path = &args[3];

    let contents = match fs::read_to_string(input_path) {
        Ok(c) => c,
        Err(e) => {
            eprintln!("Error reading file: {}", e);
            return;
        }
    };

    let result = if choice == "compress" {
        compress_lz77(&contents) // Use compress_lz77
    } else if choice == "decompress" {
        decompress_lz77(contents.as_bytes()).into_bytes() // Convert String to Vec<u8>
    } else {
        eprintln!("Unknown choice: {}", choice);
        return;
    };

    match fs::write(output_path, &result) {
        Ok(_) => println!("{} completed.", choice),
        Err(e) => eprintln!("Failed to write to output: {}", e),
    }
}
