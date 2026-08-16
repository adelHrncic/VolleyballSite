const fs = require('fs');
const { IncomingForm } = require('formidable');
const { put } = require('@vercel/blob');

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const form = new IncomingForm({ keepExtensions: true, multiples: false });

  try {
    const result = await new Promise(function (resolve, reject) {
      form.parse(req, function (error, fields, files) {
        if (error) {
          reject(error);
          return;
        }

        resolve({ fields, files });
      });
    });

    const file = result.files.file || result.files.image || result.files.video || Object.values(result.files)[0];

    if (!file) {
      return res.status(400).json({ ok: false, error: 'No file was uploaded.' });
    }

    const buffer = fs.readFileSync(file.filepath);
    const fileName = 'uploads/' + Date.now() + '-' + (file.originalFilename || 'upload');
    const blob = await put(fileName, buffer, {
      access: 'public',
      contentType: file.mimetype || 'application/octet-stream'
    });

    return res.status(200).json({ ok: true, url: blob.url });
  } catch (error) {
    console.error('File upload failed:', error);
    return res.status(500).json({ ok: false, error: 'File upload failed.' });
  }
};
