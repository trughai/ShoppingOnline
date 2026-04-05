// CLI: npm install express body-parser --save
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// --- APIS ---

// 1. Test Route
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// 2. Admin API
app.use('/api/admin', require('./api/admin.js'));

// 3. Customer API
app.use('/api/customer', require('./api/customer.js'));


// --- Deployment ---

// '/admin' serve the files at client-admin/build/* as static files
app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-admin/build', 'index.html'));
});

// '/' serve the files at client-customer/build/* as static files
app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-customer/build', 'index.html'));
});


// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});