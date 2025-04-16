use std::{env, fs};

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 4 {
        eprintln!("Usage: <program> <compress/decompress> <input_file> <output_file>");
        return;
    }

    let choice = &args[1];
    let input_path = &args[2];
    let output_path = &args[3];


    println!("{}",input_path);
    let contents = match fs::read(input_path) {
        Ok(c) => c,
        Err(e) => {
            eprintln!("Error reading file: {}", e);
            return;
        }
    };

    println!("PRINT THE INPUT:  {:?}", contents);
    let result = if choice == "compress" {
        let binary = compress(&contents);
        binary 
    } else if choice == "decompress" {
        match decompress(&contents) {
            Ok(data) => data,
            Err(e) => {
                eprintln!("Decompression error: {}", e);
                return;
            }
        }
    } else {
        eprintln!("Unknown choice: {}", choice);
        return;
    };

    match fs::write(output_path, &result) {
        Ok(_) => println!("{} completed.", choice),
        Err(e) => eprintln!("Failed to write to output: {}", e),
    }
}

pub fn compress(input: &[u8]) -> Vec<u8> {
    let window_size = 4096;
    let mut output = Vec::new();
    let mut pos = 0;

    while pos < input.len() {
        let end = usize::min(pos + window_size, input.len());
        let mut match_length = 0;
        let mut offset = 0;

        let search_start = if pos >= window_size { pos - window_size } else { 0 };
        for search_pos in search_start..pos {
            let mut length = 0;

            while length < end - pos
            && input[search_pos + length] == input[pos + length]
        {
            length += 1;
        }
            if length > match_length {
                match_length = length;
                offset = pos - search_pos;
            }
        }

        if match_length >= 1 && offset > 0 {
            output.push(0x01); // Match tag
            output.extend_from_slice(&(offset as u16).to_be_bytes());
            output.extend_from_slice(&(match_length as u16).to_be_bytes());
            pos += match_length;
        } else {
            output.push(0x00); // Literal tag
            output.push(input[pos]);
            pos += 1;
        }
    }
    println!("compress outpput is :{:?}", output );
    output
}
pub fn decompress(data: &[u8]) -> Result<Vec<u8>, String> {
    let mut result = Vec::new();
    let mut i = 0;

    while i < data.len() {
        match data[i] {
            0x00 => {
                // Case: Literal
                if i + 1 >= data.len() {
                    return Err("Unexpected end of data for literal".into());
                }
                result.push(data[i + 1]);
                i += 2;
            }
            0x01 => {
                if i + 4 >= data.len() {
                    return Err("Unexpected end of data for match".into());
                }
            
                let offset = u16::from_be_bytes([data[i + 1], data[i + 2]]) as usize;
                let length = u16::from_be_bytes([data[i + 3], data[i + 4]]) as usize;
            
                if offset == 0 || offset > result.len() {
                    return Err(format!("Invalid match offset: {}", offset));
                }
            
                let start_pos = result.len() - offset;
            
                for j in 0..length {
                    result.push(result[start_pos + j]);
                }
            
                i += 5;
            }
            0x02 => {
                return Err("Tag 0x02 is reserved or invalid".into());
            }
            other => {
                return Err(format!("Unknown tag: 0x{:02X}", other));
            }
        }
    }

    Ok(result)
}


pub fn decompress_for_test(data: &[u8]) -> Vec<u8> {
    match decompress(data) {
        Ok(result) => result,
        Err(e) => panic!("Decompression failed: {}", e),
    }
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_lz_roundtrip() {
        let input = b"ABABABABABAB";
        let compressed = compress(input);
        let decompressed = decompress_for_test(&compressed);
        assert_eq!(input.to_vec(), decompressed);
    }
}
