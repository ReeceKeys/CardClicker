const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'db',
  user: process.env.POSTGRES_USER || 'my_user',
  password: process.env.POSTGRES_PASSWORD || 'root',
  database: process.env.POSTGRES_DB || 'my_database',
  port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
});

// GET all cards
app.get('/cards', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cards ORDER BY id');
    // map `clicks` column to `count` for React
    const mapped = rows.map(r => ({ id: r.id, count: r.clicks, timestamp: r.timestamp }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST/update cards
app.post('/cards', async (req, res) => {
  const cards = req.body; // array of {id, count, timestamp}
  try {
    const values = cards.map(c => `(${c.id}, ${c.count}, '${c.timestamp}')`).join(',');
    const query = `
      INSERT INTO cards (id, clicks, timestamp)
      VALUES ${values}
      ON CONFLICT (id) DO UPDATE 
        SET clicks = EXCLUDED.clicks,
            timestamp = EXCLUDED.timestamp;
    `;
    await pool.query(query);
    res.send('Cards saved');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



app.listen(5000, () => console.log('Server running on port 5000'));
