//const express = require('express');
//const path = require('path');
//
//const app = express();
//const PORT = process.env.PORT || 3000;
//
//// Serve static files from the "public" directory
//app.use(express.static(path.join(__dirname, 'public')));
//
//// Set up the home route
//app.get('/', (req, res) => {
//    res.sendFile(path.join(__dirname, 'views', 'index.html'));
//});
//
//// Start the server
//app.listen(PORT, () => {
//    console.log(`RejoBots website running at http://localhost:${PORT}`);
//});

const express = require('express');
const helmet = require('helmet');
const fs = require('fs');
const https = require('https');
const path = require('path');

const app = express();
const PORT = 3000;
const SSL_PORT = 3443;

// Load SSL certificates
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem'))
};

// Security Middleware
app.use(helmet());  // Sets security-related HTTP headers
app.use(express.static(path.join(__dirname, 'public')));

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
    if (req.secure) {
        next();
    } else {
        res.redirect(`https://${req.headers.host}${req.url}`);
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start HTTP Server (Optional for redirection)
app.listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`);
});

// Start HTTPS Server
https.createServer(httpsOptions, app).listen(SSL_PORT, () => {
    console.log(`Secure HTTPS server running on https://localhost:${SSL_PORT}`);
});



app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://trusted.cdn.com"],
        styleSrc: ["'self'", "'unsafe-inline'"]
      }
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  })
);


const cors = require('cors');
app.use(cors({ origin: 'https://trusted-domain.com' }));


app.use(express.json({ limit: '10kb' })); // 10 KB payload limit
