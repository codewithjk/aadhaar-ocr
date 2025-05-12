interface OCRLine {
    line: number;
    text: string;
    confidence: number | string;
    bbox?: any;
}

interface AadhaarFrontData {
    name?: string;
    dob?: string;
    gender?: string;
    aadhaarNumber?: string;
}

interface AadhaarBackData {
    address?: string;
    pincode?: string;
}

export function extractAadhaarFront(lines: OCRLine[]): AadhaarFrontData {
    const text = lines.map(l => l.text).join(' ').replace(/\n/g, ' ');
    const lowerText = text.toLowerCase();

    // Validation check for front side
    const isAadhaar = /(government of india|भारत सरकार|unique identification authority)/i.test(text)
        || /\b\d{4}\s?\d{4}\s?\d{4}\b/.test(text);

    const result: AadhaarFrontData = {};

    // Aadhaar number
    const aadhaarMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);
    result.aadhaarNumber = aadhaarMatch?.[0]?.replace(/\s+/g, '');

    // Date of Birth
    const dobMatch = text.match(/(?:DOB|D0B|Date of Birth)?[:\s\-]*?(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i);
    result.dob = dobMatch?.[1];

    // Gender
    if (/male/i.test(text)) result.gender = 'Male';
    else if (/female/i.test(text)) result.gender = 'Female';
    else if (/transgender/i.test(text)) result.gender = 'Transgender';

    // Name
    const nameLine = lines.find(l =>
        l.text.match(/[A-Z][a-z]+\s+[A-Z][a-z]+/) &&
        !l.text.toLowerCase().includes('dob') &&
        parseFloat(l.confidence as string) > 40
    );
    result.name = nameLine?.text.replace(/[^a-zA-Z\s]/g, '').trim();
    if (!isAadhaar || !result.dob || !result.gender) throw new Error('This does not appear to be the front side of an Aadhaar card.');

    return result;
}




export function extractAadhaarBack(lines: OCRLine[]): AadhaarBackData {
    const result: AadhaarBackData = {};

    const normalizedLines = lines.map(l => l.text.trim());
    const fullText = normalizedLines.join(' ').toLowerCase();

    // Validate it's Aadhaar back
    if (!/(address|s\/o|c\/o|d\/o)/i.test(fullText)) {
        throw new Error('This does not appear to be the back side of an Aadhaar card.');
    }

    // Find the start of the address
    const startIdx = normalizedLines.findIndex(line =>
        /(address|s\/o|c\/o|d\/o)/i.test(line)
    );

    if (startIdx === -1) {
        throw new Error('No address block found');
    }

    // Extract  address lines
    const rawAddressLines: string[] = [];
    for (let i = startIdx; i < normalizedLines.length; i++) {
        const line = normalizedLines[i];
        const isLikelyAddressLine =
            /(address|s\/o|c\/o|d\/o)/i.test(line) ||
            /house/i.test(line) ||
            /\bpo\b/i.test(line) ||
            /\d{6}/.test(line) ||
            line.split(',').length >= 2;

        if (isLikelyAddressLine) {
            rawAddressLines.push(line);
        }

        if (rawAddressLines.length >= 6) break;
    }

    // Clean each line
    const cleanLine = (line: string): string => {
        return line
            .replace(/[^\w\s,/:-]/g, '')           
            .replace(/\b([a-zA-Z]\d|\d[a-zA-Z])\b/g, '') 
            .replace(/\b(?:[A-Za-z]{1,2}\d{1,2}|\d{1,2}[A-Za-z]{1,2})\b/g, '') 
            .replace(/\s+/g, ' ')                 
            .replace(/\b(?:ei|ey|vous|le|fh|pa|tg|sn)\b/gi, '') 
            .trim();
    };

    const cleanedLines = rawAddressLines
        .map(cleanLine)
        .filter(line => line.length >= 10); 

    result.address = cleanedLines.join(', ');

    // Extract pincode
    const pinMatch = result.address.match(/\b\d{6}\b/);
    if (pinMatch) {
        result.pincode = pinMatch[0];
    }

    return result;
}

