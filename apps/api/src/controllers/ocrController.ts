// import { Request, Response } from 'express';
// import { EasyOCR } from 'node-easyocr';

// const ocr = new EasyOCR();

// export const handleFileUpload = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const filePath = req.file?.path;

//     if (!filePath) {
//       res.status(400).send('No file uploaded');
//       return;
//     }

//     // Initialize OCR
//     await ocr.init(['en', 'fr']);
//     console.log('OCR initialized successfully');

//     // Perform OCR
//     console.time('OCR Process');
//     const result = await ocr.readText(filePath);
//     console.timeEnd('OCR Process');

//     // Format result
//     const formatted = result.map((item, index) => ({
//       line: index + 1,
//       text: item.text,
//       confidence: `${(item.confidence * 100).toFixed(2)}%`,
//       bbox: item.bbox,
//     }));

//     res.json({ text: formatted });
//   } catch (error: any) {
//     console.error('OCR Error:', error.message);
//     res.status(500).json({ error: 'OCR failed', details: error.message });
//   } finally {
//     await ocr.close();
//   }
// };
import { Request, Response } from 'express';
import { createWorker } from 'tesseract.js';

export const handleFileUpload = async (req: Request, res: Response): Promise<void> => {
  const filePath = req.file?.path;

  if (!filePath) {
    res.status(400).send('No file uploaded');
    return;
  }

  const worker = createWorker({
    logger: m => console.log(m) // optional: logs progress
  });

  try {
    console.log('⏳ Initializing Tesseract worker...');
    await worker.load(); // ← important
    await worker.loadLanguage('eng+hin'); // ← also correct
    await worker.initialize('eng+hin');

    console.time('OCR Process');
    const { data } = await worker.recognize(filePath);
    console.timeEnd('OCR Process');

    const lines = data.lines.map((line, index) => ({
      line: index + 1,
      text: line.text,
      confidence: `${line.confidence.toFixed(2)}%`,
      bbox: line.bbox
    }));

    console.log('✅ OCR Result:', lines);
    res.json({ text: lines });
  } catch (error: any) {
    console.error('🚨 OCR Error:', error.message);
    res.status(500).json({ error: 'OCR failed', details: error.message });
  } finally {
    await worker.terminate();
  }
};
