import { render, screen, fireEvent,within } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from '../App'; 

// Helper to add an item since we do it in every test
const addGroceryItem = (text) => {
  const input = screen.getByPlaceholderText(/add to the haul/i);
  const button = screen.getByText(/add/i);
  fireEvent.change(input, { target: { value: text } });
  fireEvent.click(button);
};

test('allows users to edit a grocery item', () => {
  render(<App />);
  addGroceryItem('Milk');

  // 1. Click the Edit button (the pencil icon ✎)
  const editBtn = screen.getByText('✎');
  fireEvent.click(editBtn);

  // 2. Find the edit input and change it to 'Oat Milk'
  const editInput = screen.getByDisplayValue('Milk');
  fireEvent.change(editInput, { target: { value: 'Oat Milk' } });

  // 3. Click the Save/Check button
  const saveBtn = screen.getByText(/check/i);
  fireEvent.click(saveBtn);

  // 4. Verify the change
  expect(screen.getByText('Oat Milk')).toBeInTheDocument();
  expect(screen.queryByText('Milk')).not.toBeInTheDocument();
});

test('allows users to delete a grocery item', () => {
  render(<App />);
  addGroceryItem('Bread');
  const groceryText = screen.getByText('Bread');

// Get the row that contains that text
const breadRow = groceryText.closest('.item-row')
  // 1. Find the delete button (the ✕ icon)
  const deleteBtn = within(breadRow).getByText('✕');

  // 2. Click it
  fireEvent.click(deleteBtn);

  // 3. Verify 'Bread' is gone
  expect(screen.queryByText('Bread')).not.toBeInTheDocument();
});