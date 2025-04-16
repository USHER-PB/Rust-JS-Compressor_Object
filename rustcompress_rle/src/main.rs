use std::{env, fs};

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
        compress(&contents)
    } else if choice == "decompress" {
        decompress(&contents)
    } else {
        eprintln!("Unknown choice: {}", choice);
        return;
    };

    match fs::write(output_path, &result) {
        Ok(_) => println!("{} completed.", choice),
        Err(e) => eprintln!("Failed to write to output: {}", e),
    }
}

fn compress(input: &str) -> String {
    let mut result = String::new();
    let mut chars = input.chars();

    // Get the first character to start
    let mut previous = match chars.next() {
        Some(c) => c,
        None => return result, // empty input
    };

    let mut count = 1;

    for current in chars {
        if current == previous {
            count += 1;
        } else {
            result.push(previous);
            result.push_str(&count.to_string());

            previous = current;
            count = 1;
        }
    }

    // Push the last character and its count
    result.push(previous);
    result.push_str(&count.to_string());

    result
}
fn decompress(input: &str) -> String {
    let mut result = String::new();
    let mut chars = input.chars().peekable();

    while let Some(ch) = chars.next() {
        let mut count_str = String::new();
        while let Some(&digit) = chars.peek() {
            if digit.is_ascii_digit() {
                count_str.push(digit);
                chars.next();
            } else {
                break;
            }
        }
        let count: usize = count_str.parse().unwrap_or(1);
        result.push_str(&ch.to_string().repeat(count));
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rle_roundtrip() {
        let input = "AAABBBCCCCCDDDDE";
        let compressed = compress(input);
        let decompressed = decompress(&compressed);
        assert_eq!(input, decompressed);
    }
}
