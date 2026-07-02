const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  const isMatch = await bcrypt.compare(password, process.env.ORGANIZER_PASSWORD_HASH);
  if (!isMatch) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const token = jwt.sign({ role: 'organizer' }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

module.exports = router;