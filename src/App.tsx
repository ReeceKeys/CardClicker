import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './App.css';

interface Card {
  id: number;
  count: number;
  timestamp: string;
}

function App() {
  const [cards, setCards] = React.useState<Card[]>([]);
  const [slider, setSlider] = React.useState(0);
  const sliderVal = slider === 0 ? 'Most Counts' : 'First Click Time';

  // Load cards from backend on mount
  useEffect(() => {
    fetch('http://localhost:5000/cards')
      .then(res => res.json())
      .then(data => setCards(data))
      .catch(err => console.error('Error fetching cards:', err));
  }, []);

  // Increment count safely
  function incrementCount(id: number) {
const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');     setCards(prev =>
      prev.map(card => {
        if (card.id === id) {
          const newTimestamp = card.count === 0 ? currentTime : card.timestamp;
          return { ...card, count: card.count + 1, timestamp: newTimestamp };
        }
        return card;
      })
    );

    // Save immediately after increment
    saveCardsToBackend(cards.map(c =>
      c.id === id
        ? { ...c, count: c.count + 1, timestamp: c.count === 0 ? currentTime : c.timestamp }
        : c
    ));
  }

  // Clear all counts and timestamps
  function clearCounts() {
    const confirmed = window.confirm("Are you sure you want to clear all data?");
    if (!confirmed) return;

    const resetCards = cards.map(card => ({ ...card, count: 0, timestamp: '' }));
    setCards(resetCards);
    saveCardsToBackend(resetCards);
  }


  // Save cards to backend
  function saveCardsToBackend(cardsToSave: Card[]) {
    fetch('http://localhost:5000/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardsToSave),
    }).catch(err => console.error('Error saving cards:', err));
  }

  // Sort cards based on slider
  const sortedCards = [...cards].sort((a, b) => {
    if (slider === 0) {
      // Sort by MOST COUNTS
      if (b.count !== a.count) return b.count - a.count;
      if (a.timestamp && b.timestamp) return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      if (a.timestamp && !b.timestamp) return -1;
      if (!a.timestamp && b.timestamp) return 1;
      return 0;
    } else {
      // Sort by FIRST CLICK TIME
      if (a.timestamp && b.timestamp) return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      if (a.timestamp && !b.timestamp) return -1;
      if (!a.timestamp && b.timestamp) return 1;
      return 0;
    }
  });

  return (
    <div className="App">
        <h1 className="title">Card Clicker</h1>
      <div className="toggle-buttons">
          <button
            className={slider === 0 ? 'active' : ''}
            onClick={() => setSlider(0)}
          >
            Most Clicks
          </button>
          <button
            className={slider === 1 ? 'active' : ''}
            onClick={() => setSlider(1)}
          >
            First Click Time
          </button>
        </div>
      <div className="container">
        
        {sortedCards.map(card => (
          <div className="card" key={card.id} onClick={() => incrementCount(card.id)}>
            <div className="id">{card.id}</div>
            <div className="counts">Clicks: {card.count}</div>
            <div className="timestamp">{card.timestamp && <>First Click: {card.timestamp}<br /></>}</div>
          </div>
        ))}
      </div>

        

      <div className="trash-container">
        <button className="button trash" onClick={(e) => { e.stopPropagation(); clearCounts(); }}><FontAwesomeIcon icon={faTrash} /></button>
      </div>
    </div>
  );
}
 
export default App;
