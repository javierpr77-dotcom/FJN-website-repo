import http from 'node:http';
http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, '\nData length:', data.length));
}).on('error', err => console.error(err));
