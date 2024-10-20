import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import { Plus, SplitSquareVertical } from 'lucide-react';

interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface Board {
  id: string;
  name: string;
  columns: { [key: string]: Column };
}

interface KanbanBoardProps {
  board: Board;
  updateBoard: (board: Board) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ board, updateBoard }) => {
  const [columns, setColumns] = useState<{ [key: string]: Column }>(board.columns);
  const [newCardContent, setNewCardContent] = useState('');
  const [selectedColumn, setSelectedColumn] = useState(Object.keys(board.columns)[0]);

  useEffect(() => {
    setColumns(board.columns);
    setSelectedColumn(Object.keys(board.columns)[0]);
  }, [board]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...destColumn.tasks];
    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, removed);

    const newColumns = {
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: sourceTasks,
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destTasks,
      },
    };

    setColumns(newColumns);
    updateBoard({ ...board, columns: newColumns });
  };

  const addCard = () => {
    if (newCardContent.trim()) {
      const newTask: Task = { id: uuidv4(), content: newCardContent.trim() };
      const newColumns = {
        ...columns,
        [selectedColumn]: {
          ...columns[selectedColumn],
          tasks: [...columns[selectedColumn].tasks, newTask],
        },
      };
      setColumns(newColumns);
      updateBoard({ ...board, columns: newColumns });
      setNewCardContent('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCard();
    }
  };

  const addColumn = () => {
    const newColumnId = uuidv4();
    const newColumns = {
      ...columns,
      [newColumnId]: {
        id: newColumnId,
        title: 'New Column',
        tasks: [],
      },
    };
    setColumns(newColumns);
    updateBoard({ ...board, columns: newColumns });
  };

  const editColumnTitle = (columnId: string, newTitle: string) => {
    const newColumns = {
      ...columns,
      [columnId]: {
        ...columns[columnId],
        title: newTitle,
      },
    };
    setColumns(newColumns);
    updateBoard({ ...board, columns: newColumns });
  };

  const splitTextToCards = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim() !== '');
    const newTasks = sentences.map(sentence => ({
      id: uuidv4(),
      content: sentence.trim()
    }));
    
    const newColumns = {
      ...columns,
      [selectedColumn]: {
        ...columns[selectedColumn],
        tasks: [...columns[selectedColumn].tasks, ...newTasks]
      }
    };
    
    setColumns(newColumns);
    updateBoard({ ...board, columns: newColumns });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 p-4">
        <h1 className="text-2xl font-bold">{board.name}</h1>
        <div className="flex space-x-2">
          <button
            onClick={addColumn}
            className="button-primary flex items-center"
          >
            <Plus size={16} className="mr-1" /> Add Column
          </button>
          <button
            onClick={() => {
              const text = prompt("Enter text to split into cards:");
              if (text) splitTextToCards(text);
            }}
            className="button-secondary flex items-center"
          >
            <SplitSquareVertical size={16} className="mr-1" /> Split Text
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4 px-4">
        <input
          type="text"
          value={newCardContent}
          onChange={(e) => setNewCardContent(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow input-field"
          placeholder="Enter card content..."
        />
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          className="input-field"
        >
          {Object.values(columns).map((column) => (
            <option key={column.id} value={column.id}>
              {column.title}
            </option>
          ))}
        </select>
        <button onClick={addCard} className="button-primary">
          Add
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-full overflow-x-auto p-4 space-x-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="bg-white p-4 rounded-lg w-72 flex-shrink-0 shadow-md">
              <input
                type="text"
                value={column.title}
                onChange={(e) => editColumnTitle(columnId, e.target.value)}
                className="font-bold mb-4 p-1 w-full"
              />
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px]"
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-100 p-2 mb-2 rounded-lg shadow-sm"
                          >
                            {task.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;