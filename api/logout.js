module.exports = async function (req, res) {
  var isSecure = req.headers && (req.headers['x-forwarded-proto'] === 'https' || (req.headers.origin && req.headers.origin.indexOf('https://') === 0));
  var cookieValue = 'admin_session=; HttpOnly;' + (isSecure ? ' Secure;' : '') + ' SameSite=Lax; Path=/; Max-Age=0';
  res.setHeader('Set-Cookie', cookieValue);
  return res.status(200).json({ ok: true });
};
