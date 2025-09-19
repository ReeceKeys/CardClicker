-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    clicks INT NOT NULL DEFAULT 0,
    timestamp TEXT DEFAULT ''
);

-- Insert 8 cards with clicks = 0 and empty timestamp
INSERT INTO cards (id, clicks, timestamp) VALUES
    (1, 0, ''),
    (2, 0, ''),
    (3, 0, ''),
    (4, 0, ''),
    (5, 0, ''),
    (6, 0, ''),
    (7, 0, ''),
    (8, 0, '')
ON CONFLICT (id) DO NOTHING;
