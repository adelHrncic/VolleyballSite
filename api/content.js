const { list, put } = require('@vercel/blob');
const fallback = require('../content/site.json');

async function getLiveContent() {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return null;
    }

    const { blobs } = await list();
    const savedBlob = blobs.find(function (blob) {
      return blob.pathname === 'site-content.json';
    });

    if (!savedBlob) {
      return null;
    }

    const response = await fetch(savedBlob.url);
    return await response.json();
  } catch (error) {
    console.error('Failed to load saved content from blob storage:', error);
    return null;
  }
}

module.exports = async function (req, res) {
  if (req.method === 'GET') {
    const liveContent = await getLiveContent();
    if (liveContent) {
      return res.status(200).json(liveContent);
    }

    return res.status(200).json(fallback);
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    let body = req.body;

    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (error) {
        return res.status(400).json({ ok: false, error: 'Invalid JSON body.' });
      }
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({ ok: false, error: 'Missing content payload.' });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({
        ok: false,
        error: 'Blob storage is not configured. Add BLOB_READ_WRITE_TOKEN in Vercel.'
      });
    }

    try {
      const blob = await put('site-content.json', JSON.stringify(body, null, 2), {
        access: 'public',
        contentType: 'application/json',
        allowOverwrite: true
      });
      return res.status(200).json({ ok: true, url: blob.url });
    } catch (error) {
      console.error('Failed to save content to blob storage:', error);

      const message = error && error.message ? error.message : 'Unable to save content to blob storage.';
      const friendlyMessage = message.indexOf('public access on a private store') !== -1
        ? 'This Blob store is configured as private. Change the Blob store to Public in Vercel, or switch this app to a private signed-download flow.'
        : message;

      return res.status(500).json({
        ok: false,
        error: friendlyMessage
      });
    }
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed.' });
};
