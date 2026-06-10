export default async function handler(req, res) {
  // CORS 预检
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }

  try {
    const { url, method = 'GET', body, authToken } = req.body || {};

    // 安全校验：只允许转发飞书域名
    if (!url || !url.startsWith('https://open.feishu.cn')) {
      return res.status(400).json({ error: '非法请求地址，只允许飞书域名' });
    }

    const headers = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers['Authorization'] = 'Bearer ' + authToken;
    }

    const fetchOpts = { method, headers };
    if (body && method !== 'GET') {
      fetchOpts.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOpts);
    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error('代理错误:', err);
    return res.status(500).json({ error: err.message });
  }
}
