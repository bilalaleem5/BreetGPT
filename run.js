// Simple HTTP server for testing the BGPT project
const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  // Get file path from URL
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  // Get file extension
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';

  // Read file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        fs.readFile('./404.html', (error, content) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  console.log('Press Ctrl+C to stop the server');
});

// Handle 404 page
fs.writeFileSync('./404.html', `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Page Not Found</title>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #0f172a;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    .container {
      max-width: 600px;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #3b82f6, #f97316);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }
    a {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6, #f97316);
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      text-decoration: none;
      transition: transform 0.3s ease;
    }
    a:hover {
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist or has been moved.</p>
    <a href="/">Return to Home</a>
  </div>
</body>
</html>
`);

console.log('\nCreated a custom 404 page for better user experience');
console.log('\nBGPT Premium is ready to use! Open your browser to http://localhost:3000/'); 