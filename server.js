const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const subcategoryRoutes = require('./routes/subcategory.routes');
const rentRoutes = require('./routes/rent.routes');
const newStockRoutes = require('./routes/newStock.routes');
const depositRoutes = require('./routes/deposit.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const customerRoutes = require('./routes/customer.routes');
const inoutRoutes = require('./routes/inout.routes');
const outDataRoutes = require('./routes/out.routes');
const inDataRoutes = require('./routes/in.routes');
const invoiceRoutes = require('./routes/invoice.routes');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.LOCALHOST_URL,
  "https://cerm-frontend.vercel.app",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/aadhaar_other_files', express.static(path.join(__dirname, 'aadhaar_other_files')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/rents", rentRoutes);
app.use('/api/inouts', inoutRoutes);
app.use("/api/stockdata", newStockRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/outdata", outDataRoutes);
app.use("/api/indata", inDataRoutes);
app.use('/api/invoice', invoiceRoutes);

// --- Socket.io setup ---
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
});

app.set('io', io); // Make io available in controllers

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});