import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface BoardListProps {
  boards: { id: string; name: string }[];
  activeBoard: string | null;
  setActiveBoard: (boardId: string) => void;
  onAddBoard: () => void;
  onRenameBoard: (id: string, newName: string) => void;
  onDeleteBoard: (id: string) => void;
}

const BoardList: React.FC<BoardListProps> = ({
  boards,
  activeBoard,
  setActiveBoard,
  onAddBoard,
  onRenameBoard,
  onDeleteBoard,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleRename = (id: string) => {
    setEditingId(id);
    setEditName(boards.find(board => board.id === id)?.name || '');
  };

  const submitRename = (id: string) => {
    if (editName.trim()) {
      onRenameBoard(id, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="bg-white border-t border-gray-200 transition-all duration-300">
      <div 
        className="flex justify-between items-center px-4 py-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="font-semibold text-primary">Boards</h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddBoard();
          }}
          className="p-1 rounded-full bg-gray-200 text-primary hover:bg-gray-300 transition-all"
        >
          <Plus size={16} />
        </button>
      </div>
      {isExpanded && (
        <div className="overflow-y-auto max-h-64 px-4">
          {boards.map((board) => (
            <div
              key={board.id}
              className={`flex items-center justify-between py-2 px-2 rounded-lg transition duration-200 ${
                activeBoard === board.id ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
            >
              {editingId === board.id ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => submitRename(board.id)}
                  onKeyPress={(e) => e.key === 'Enter' && submitRename(board.id)}
                  className="flex-1 px-2 py-1 text-sm border rounded"
                  autoFocus
                />
              ) : (
                <span
                  className="flex-1 cursor-pointer"
                  onClick={() => setActiveBoard(board.id)}
                >
                  {board.name}
                </span>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRename(board.id)}
                  className="p-1 rounded hover:bg-gray-200 transition-all"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDeleteBoard(board.id)}
                  className="p-1 rounded hover:bg-gray-200 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardList;