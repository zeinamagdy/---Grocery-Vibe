import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("groceries");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  // --- State for Editing ---
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("groceries", JSON.stringify(items));
  }, [items]);

  const addItem = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    setItems([...items, { id: Date.now(), text: input, bought: false }]);
    setInput("");
  };

  const toggleBought = (id: number) => {
    setItems(
      items.map((item: { id: number; text: string; bought: boolean }) =>
        item.id === id ? { ...item, bought: !item.bought } : item,
      ),
    );
  };

  const saveEdit = (id: number) => {
    setItems(
      items.map((item: { id: number; text: string; bought: boolean }) =>
        item.id === id ? { ...item, text: editText } : item,
      ),
    );
    setEditId(null); // Exit edit mode
    setEditText("");
  };

  const removeItem = (id: number) => {
    setItems(
      items.filter(
        (item: { id: number; text: string; bought: boolean }) => item.id !== id,
      ),
    );
  };
  const removeAll = () => {
    setItems([]);
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">🛒 Grocery Vibe</h2>

        <form onSubmit={addItem} className="form">
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add to the haul..."
          />
          <button type="submit" className="add-button">
            Add
          </button>
        </form>

        <div className="list-container">
          {items.map((item: { id: number; text: string; bought: boolean }) => (
            <div key={item.id} className="item-row">
              {editId === item.id ? (
                // --- EDIT MODE UI ---
                <div className="edit-mode">
                  <input
                    className="input edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(item.id)}
                    className="save-btn"
                  >
                    Check
                  </button>
                </div>
              ) : (
                // --- VIEW MODE UI ---
                <>
                  <span
                    onClick={() => toggleBought(item.id)}
                    className={`item-text ${item.bought ? "bought" : ""}`}
                  >
                    {item.text}
                  </span>
                  <div className="actions">
                    <button
                      onClick={() => {
                        setEditId(item.id);
                        setEditText(item.text);
                      }}
                      className="edit-btn"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="delete-btn"
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <p className="footer">
            <button onClick={removeAll} className="clear-btn">
              Clear All
            </button>{" "}
            {
              items.filter(
                (i: { id: number; text: string; bought: boolean }) => !i.bought,
              ).length
            }{" "}
            items left to grab
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
