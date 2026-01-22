import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TodoApp from './TodoApp';

describe('TodoApp Component', () => {
  describe('Rendering', () => {
    test('renders the app title', () => {
      render(<TodoApp />);
      expect(screen.getByText('✓ My Todo List')).toBeInTheDocument();
    });

    test('renders input field with placeholder', () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Add a new todo...');
    });

    test('renders add button', () => {
      render(<TodoApp />);
      expect(screen.getByTestId('add-btn')).toBeInTheDocument();
    });

    test('renders filter buttons', () => {
      render(<TodoApp />);
      expect(screen.getByTestId('filter-all')).toBeInTheDocument();
      expect(screen.getByTestId('filter-active')).toBeInTheDocument();
      expect(screen.getByTestId('filter-completed')).toBeInTheDocument();
    });

    test('shows empty state when no todos', () => {
      render(<TodoApp />);
      expect(screen.getByTestId('empty-state')).toHaveTextContent(
        'No todos yet. Add one to get started!'
      );
    });
  });

  describe('Adding Todos', () => {
    test('adds a todo when add button is clicked', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      await userEvent.type(input, 'Buy groceries');
      fireEvent.click(addBtn);

      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    test('adds a todo when Enter key is pressed', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');

      await userEvent.type(input, 'Learn React');
      fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

      expect(screen.getByText('Learn React')).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    test('does not add empty todos', async () => {
      render(<TodoApp />);
      const addBtn = screen.getByTestId('add-btn');

      fireEvent.click(addBtn);
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    test('does not add whitespace-only todos', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      await userEvent.type(input, '   ');
      fireEvent.click(addBtn);

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    test('adds multiple todos', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      await userEvent.type(input, 'Todo 1');
      fireEvent.click(addBtn);
      await userEvent.type(input, 'Todo 2');
      fireEvent.click(addBtn);
      await userEvent.type(input, 'Todo 3');
      fireEvent.click(addBtn);

      expect(screen.getByText('Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Todo 2')).toBeInTheDocument();
      expect(screen.getByText('Todo 3')).toBeInTheDocument();
    });
  });

  describe('Deleting Todos', () => {
    test('deletes a todo when delete button is clicked', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      await userEvent.type(input, 'Todo to delete');
      fireEvent.click(addBtn);

      const deleteBtn = screen.getByTestId(/delete-btn-/);
      fireEvent.click(deleteBtn);

      expect(screen.queryByText('Todo to delete')).not.toBeInTheDocument();
    });

    test('deletes specific todo from multiple todos', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      await userEvent.type(input, 'Todo 1');
      fireEvent.click(addBtn);
      await userEvent.type(input, 'Todo 2');
      fireEvent.click(addBtn);
      await userEvent.type(input, 'Todo 3');
      fireEvent.click(addBtn);

      const deleteBtns = screen.getAllByTestId(/delete-btn-/);
      fireEvent.click(deleteBtns[1]);

      expect(screen.getByText('Todo 1')).toBeInTheDocument();
      expect(screen.queryByText('Todo 2')).not.toBeInTheDocument();
      expect(screen.getByText('Todo 3')).toBeInTheDocument();
    });
  });

  describe('Toggling Todos', () => {
    test('marks a todo as completed when checkbox is clicked', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      await userEvent.type(input, 'Complete this task');
      fireEvent.click(addBtn);

      const checkbox = screen.getByTestId(/checkbox-/);
      fireEvent.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    test('applies completed class styling to completed todos', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      await userEvent.type(input, 'Completed todo');
      fireEvent.click(addBtn);

      const checkbox = screen.getByTestId(/checkbox-/);
      fireEvent.click(checkbox);

      const todoItem = screen.getByTestId(/todo-item-/);
      expect(todoItem).toHaveClass('completed');
    });

    test('unchecks a completed todo', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      await userEvent.type(input, 'Toggle task');
      fireEvent.click(addBtn);

      const checkbox = screen.getByTestId(/checkbox-/);
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('Filtering Todos', () => {
    beforeEach(async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      await userEvent.type(input, 'Task 1');
      fireEvent.click(addBtn);
      await userEvent.type(input, 'Task 2');
      fireEvent.click(addBtn);
      await userEvent.type(input, 'Task 3');
      fireEvent.click(addBtn);

      const checkboxes = screen.getAllByTestId(/checkbox-/);
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[2]);
    });

    test('shows all todos on "All" filter', () => {
      const filterAllBtn = screen.getByTestId('filter-all');
      fireEvent.click(filterAllBtn);

      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    test('shows only active todos on "Active" filter', () => {
      const filterActiveBtn = screen.getByTestId('filter-active');
      fireEvent.click(filterActiveBtn);

      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
    });

    test('shows only completed todos on "Completed" filter', () => {
      const filterCompletedBtn = screen.getByTestId('filter-completed');
      fireEvent.click(filterCompletedBtn);

      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    test('highlights active filter button', () => {
      const filterAllBtn = screen.getByTestId('filter-all');
      const filterActiveBtn = screen.getByTestId('filter-active');

      fireEvent.click(filterActiveBtn);
      expect(filterActiveBtn).toHaveClass('active');
      expect(filterAllBtn).not.toHaveClass('active');
    });
  });

  describe('Stats Counter', () => {
    test('updates total count when todos are added', async () => {
      render(<TodoApp />);
      const totalCount = screen.getByTestId('total-count');

      expect(totalCount).toHaveTextContent('0');

      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      await userEvent.type(input, 'Todo 1');
      fireEvent.click(addBtn);

      expect(totalCount).toHaveTextContent('1');

      await userEvent.type(input, 'Todo 2');
      fireEvent.click(addBtn);

      expect(totalCount).toHaveTextContent('2');
    });

    test('updates active count when todos are completed', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');
      const activeCount = screen.getByTestId('active-count');

      await userEvent.type(input, 'Active task');
      fireEvent.click(addBtn);

      expect(activeCount).toHaveTextContent('1');

      const checkbox = screen.getByTestId(/checkbox-/);
      fireEvent.click(checkbox);

      expect(activeCount).toHaveTextContent('0');
    });

    test('updates completed count when todos are marked complete', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');
      const completedCount = screen.getByTestId('completed-count');

      await userEvent.type(input, 'Complete task');
      fireEvent.click(addBtn);

      expect(completedCount).toHaveTextContent('0');

      const checkbox = screen.getByTestId(/checkbox-/);
      fireEvent.click(checkbox);

      expect(completedCount).toHaveTextContent('1');
    });
  });

  describe('Clear Completed', () => {
    test('clear completed button appears only when there are completed todos', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      expect(screen.queryByTestId('clear-completed-btn')).not.toBeInTheDocument();

      await userEvent.type(input, 'Task to complete');
      fireEvent.click(addBtn);

      const checkbox = screen.getByTestId(/checkbox-/);
      fireEvent.click(checkbox);

      expect(screen.getByTestId('clear-completed-btn')).toBeInTheDocument();
    });

    test('clears all completed todos when button is clicked', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      await userEvent.type(input, 'Task 1');
      fireEvent.click(addBtn);
      await userEvent.type(input, 'Task 2');
      fireEvent.click(addBtn);
      await userEvent.type(input, 'Task 3');
      fireEvent.click(addBtn);

      const checkboxes = screen.getAllByTestId(/checkbox-/);
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);

      const clearBtn = screen.getByTestId('clear-completed-btn');
      fireEvent.click(clearBtn);

      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });
  });

  describe('Input Handling', () => {
    test('clears input after adding todo', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      await userEvent.type(input, 'New task');
      fireEvent.click(addBtn);

      expect(input).toHaveValue('');
    });

    test('handles long todo text', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');
      const longText = 'This is a very long todo text that should be displayed properly in the todo item';

      await userEvent.type(input, longText);
      fireEvent.click(addBtn);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    test('handles special characters in todo text', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');
      const specialText = 'Buy items: milk & bread @ $5 (50% off!)';

      await userEvent.type(input, specialText);
      fireEvent.click(addBtn);

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    test('complete todo workflow', async () => {
      render(<TodoApp />);
      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      await userEvent.type(input, 'Buy groceries');
      fireEvent.click(addBtn);
      await userEvent.type(input, 'Clean house');
      fireEvent.click(addBtn);
      await userEvent.type(input, 'Call mom');
      fireEvent.click(addBtn);

      expect(screen.getByTestId('total-count')).toHaveTextContent('3');
      expect(screen.getByTestId('active-count')).toHaveTextContent('3');

      const checkboxes = screen.getAllByTestId(/checkbox-/);
      fireEvent.click(checkboxes[0]);

      expect(screen.getByTestId('active-count')).toHaveTextContent('2');
      expect(screen.getByTestId('completed-count')).toHaveTextContent('1');

      fireEvent.click(screen.getByTestId('filter-completed'));
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.queryByText('Clean house')).not.toBeInTheDocument();

      const deleteBtn = screen.getByTestId(/delete-btn-/);
      fireEvent.click(deleteBtn);

      expect(screen.getByTestId('total-count')).toHaveTextContent('2');
    });
  });
});
