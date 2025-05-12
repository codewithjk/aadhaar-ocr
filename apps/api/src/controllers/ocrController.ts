
import { Request, Response } from 'express';
import { createWorker } from 'tesseract.js';
import { extractAadhaarBack, extractAadhaarFront } from '../utils/dataExtractor';

export const handleFileUpload = async (req: Request, res: Response): Promise<void> => {
  const { type } = req.body;
  const imageBuffer = req.file?.buffer;

  if (!imageBuffer) {
    res.status(400).send('No file uploaded');
    return;
  }
  const worker = createWorker();

  try {
    console.log('⏳ Initializing Tesseract worker...');
    await worker.load();
    await worker.loadLanguage('eng+hin'); 
    await worker.initialize('eng+hin');

    console.time('OCR Process');
    const { data } = await worker.recognize(imageBuffer);
    console.timeEnd('OCR Process');

    const lines = data.lines.map((line, index) => ({
      line: index + 1,
      text: line.text,
      confidence: `${line.confidence.toFixed(2)}%`,
      bbox: line.bbox
    }));

    console.log('✅ OCR Result:', lines);
    let result = {}
    if (type == "front") {
      result =  extractAadhaarFront(lines)
    } else {
      console.log("this is back")
      result = extractAadhaarBack(lines)
    }
    res.json({ text: result });
  } catch (error: any) {
    console.error('🚨 OCR Error:', error.message);
    res.status(500).json({ error: 'OCR failed', details: error.message });
  } finally {
    await worker.terminate();
  }
};
