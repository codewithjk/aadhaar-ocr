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
    const text = lines.map(l => l.text).join(' ').replace(/\n/g, ' ');
    const lowerText = text.toLowerCase();

    // Validate back side
    const hasAddressKeywords = /(address|s\/o|c\/o|d\/o)/i.test(text);
    if (!hasAddressKeywords) throw new Error('This does not appear to be the back side of an Aadhaar card.');

    const result: AadhaarBackData = {};

    // Extract address block
    const startIndex = lines.findIndex(l => /address|s\/o|c\/o|d\/o/i.test(l.text));
    if (startIndex !== -1) {
        const addressLines = lines.slice(startIndex, startIndex + 5)
            .map(l => l.text.replace(/\n/g, '').trim())
            .filter(l => l.length > 3);
        result.address = addressLines.join(', ');
    }

    // Pincode
    const pinMatch = text.match(/\b\d{6}\b/);
    result.pincode = pinMatch?.[0];

    return result;
}
