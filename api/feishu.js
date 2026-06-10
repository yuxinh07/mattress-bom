export default async function handler(req, res) {
  // CORS预检
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { url, method = 'GET', body } = req.body || {};
    if (!url || !url.startsWith('https://open.feishu.cn')) {
      return res.status(400).json({ error: '非法请求地址' });
    }

    const fetchOpts = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (body) fetchOpts.body = JSON.stringify(body);

    const response = await fetch(url, fetchOpts);
    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
