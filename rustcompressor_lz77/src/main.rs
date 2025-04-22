use std::{env, fs, io::{self, Read, Write}};
use rustcompressor_lz77::{compress_lz77, decompress_lz77};

fn main() {
    let args: Vec<String> = env::args().collect();

    // Determine operation mode
    let (choice, input_data): (String, Vec<u8>) = if args.len() >= 2 {
        let choice = args[1].clone();
        let input_data = if args.len() >= 3 {
            fs::read(&args[2]).expect("Failed to read input file")
        } else {
            let mut buffer = Vec::new();
            match io::stdin().read_to_end(&mut buffer){
                Ok(buffer) => buffer,
                Err(e) => {
                    eprintln!("no file present:{}", e);
                    return
                }
            };
            buffer
           
        };
        (choice, input_data)
    } else {
        eprintln!("Usage: <compress|decompress> [input_file] [output_file]");
        std::process::exit(1);
    };

    // Run compression or decompression
    let result = if choice == "compress" {
        compress_lz77(&String::from_utf8_lossy(&input_data))
    } else if choice == "decompress" {
        decompress_lz77(&input_data).into_bytes()
    } else {
        eprintln!("Unknown command: {}", choice);
        std::process::exit(1);
    };

    // Write to output file or stdout
    if args.len() >= 4 {
        match fs::write(&args[3], &result){
            Ok(_) => {
                println!(" [process completed result in  :{:?}", &args[3]);
            }
            Err(e) =>  {
                eprintln!("NO Output file found:{}", e);
            }
        };
    } else {
        match io::stdout().write_all(&result){
        Ok(_) => {
            println!("file sucefulllt compressed to :{:?}", result);
        }
        Err(e) =>  {
            eprintln!("NO Output file found:{}", e);
        }
    };
    }
}