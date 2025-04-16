
    function compress(buffer) {
        const result = [];
        let i = 0;
    
        while (i < buffer.length) {
            let count = 1;
            const current = buffer[i];
    
            while (i + count < buffer.length && buffer[i + count] === current && count < 255) {
                count++;
            }
    
            result.push(current);
            result.push(count);
            i += count;
        }
    
        return Buffer.from(result);
    }

    module.exports = {
        compress,
    }; 