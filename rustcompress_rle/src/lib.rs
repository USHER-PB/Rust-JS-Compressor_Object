pub mod lib {
    pub fn compress_rle(input: &str) -> Vec<u8> {
        // Your RLE compression implementation
        vec![]
    }

    pub fn decompress_rle(input: &[u8]) -> String {
        // Your RLE decompression implementation
        String::new()
    }
}

pub fn compress(input: &str) -> String {
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

pub fn decompress(input: &str) -> String {
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
        // Add a safety check for count
        let count: usize = count_str.parse().unwrap_or(1);
        // Limit the maximum repeat count to prevent memory issues
        let safe_count = count.min(1000);
        result.push_str(&ch.to_string().repeat(safe_count));
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