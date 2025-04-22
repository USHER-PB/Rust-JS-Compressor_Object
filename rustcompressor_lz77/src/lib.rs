pub mod lz77 {
    pub fn compress_lz77(input: &str) -> Vec<u8> {
        let window_size = 4096;
        let lookahead_size = 18;
        let mut output = Vec::new();
        let mut pos = 0;

        while pos < input.len() {
            let mut match_length = 0;
            let mut offset = 0;

            let search_start = if pos > window_size { pos - window_size } else { 0 };
            let lookahead_end = std::cmp::min(pos + lookahead_size, input.len());

            for search_pos in search_start..pos {
                let mut length = 0;
                while pos + length < lookahead_end && 
                      input.chars().nth(search_pos + length) == input.chars().nth(pos + length) {
                    length += 1;
                }

                if length > match_length {
                    match_length = length;
                    offset = pos - search_pos;
                }
            }

            if match_length >= 2 {
                output.push(1); // Tag for match
                output.push(offset as u8);
                output.push(match_length as u8);
                if let Some(c) = input.chars().nth(pos + match_length) {
                    output.push(c as u8);
                } else {
                    output.push(0);
                }
                pos += match_length + 1;
            } else {
                output.push(0); // Tag for literal
                if let Some(c) = input.chars().nth(pos) {
                    output.push(c as u8);
                }
                pos += 1;
            }
        }

        output
    }

    pub fn decompress_lz77(input: &[u8]) -> String {
        let mut result = String::new();
        let mut pos = 0;

        while pos < input.len() {
            let tag = input[pos];
            pos += 1;

            if tag == 0 {
                // Literal
                if pos < input.len() {
                    result.push(input[pos] as char);
                    pos += 1;
                }
            } else if tag == 1 {
                // Match
                if pos + 2 < input.len() {
                    let offset = input[pos] as usize;
                    let length = input[pos + 1] as usize;
                    pos += 2;

                    let start = result.len() - offset;
                    for i in 0..length {
                        if let Some(c) = result.chars().nth(start + i) {
                            result.push(c);
                        }
                    }

                    if pos < input.len() && input[pos] != 0 {
                        result.push(input[pos] as char);
                    }
                    pos += 1;
                }
            }
        }

        result
    }
} 