require('dotenv').config();
const express = require('express');
const cors = require('cors');
const eventsRouter = require('./routes/events');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));