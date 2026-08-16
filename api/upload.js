const fs = require('fs');
const { IncomingForm } = require('formidable');
const { put } = require('@vercel/blob');

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const form = new IncomingForm({ keepExtensions: true, multiples: false });

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({
        ok: false,
        error: 'Upload storage is not configured. Add BLOB_READ_WRITE_TOKEN in Vercel.'
      });
    }

    const result = await new Promise(function (resolve, reject) {
      form.parse(req, function (error, fields, files) {
        if (error) {
          reject(error);
          return;
        }

        resolve({ fields, files });
      });
    });

    const rawFile = result.files.file || result.files.image || result.files.video || Object.values(result.files)[0];
    const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;

    if (!file) {
      return res.status(400).json({ ok: false, error: 'No file was uploaded.' });
    }

    const filePath = file.filepath || file.path;
    if (!filePath) {
      return res.status(400).json({
        ok: false,
        error: 'Uploaded file is missing its temporary path. Please try again.'
      });
    }

    const buffer = fs.readFileSync(filePath);
    const fileName = 'uploads/' + Date.now() + '-' + (file.originalFilename || file.name || 'upload');
    const blob = await put(fileName, buffer, {
      access: 'public',
      contentType: file.mimetype || file.type || 'application/octet-stream'
    });

    return res.status(200).json({ ok: true, url: blob.url });
  } catch (error) {
    console.error('File upload failed:', error);
    return res.status(500).json({
      ok: false,
      error: error && error.message ? error.message : 'File upload failed.'
    });
  }
};
