module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  let body = req.body;

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (error) {
      return res.status(400).json({ ok: false, error: 'Invalid JSON payload.' });
    }
  }

  const username = String(body && body.username ? body.username : '').trim();
  const password = String(body && body.password ? body.password : '').trim();
  const validUsername = process.env.ADMIN_USERNAME || 'admin123';
  const validPassword = process.env.ADMIN_PASSWORD || 'Volleyball339';

  if (username !== validUsername || password !== validPassword) {
    return res.status(401).json({ ok: false, error: 'Invalid username or password.' });
  }

  var isSecure = req.headers && (req.headers['x-forwarded-proto'] === 'https' || (req.headers.origin && req.headers.origin.indexOf('https://') === 0));
  var cookieValue = 'admin_session=authenticated; HttpOnly;' + (isSecure ? ' Secure;' : '') + ' SameSite=Lax; Path=/; Max-Age=86400';
  res.setHeader('Set-Cookie', cookieValue);
  return res.status(200).json({ ok: true });
};
