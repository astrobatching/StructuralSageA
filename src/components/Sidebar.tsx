import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, Search } from 'lucide-react';
import StructuralSageIcon from './StructuralSageIcon';
import BoardList from './BoardList';

interface Board {
  id: string;
  name: string;
}

interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  messages: ChatMessage[];
  lastTimestamp: Date;
}

interface SidebarProps {
  boards: Board[];
  activeBoard: string | null;
  onBoardSelect: (boardId: string) => void;
  onAddBoard: () => void;
  onEditBoard: (boardId: string, newName: string) => void;
  onDeleteBoard: (boardId: string) => void;
  conversations: Conversation[];
  onAddChat: () => void;
  onSelectChat: (conversationId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  boards,
  activeBoard,
  onBoardSelect,
  onAddBoard,
  onEditBoard,
  onDeleteBoard,
  conversations,
  onAddChat,
  onSelectChat
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(true);

  const sageOptions = [
    'Structural Sage',
    'Life Coach',
    'Digital Decision',
    'Superconscious Sesh'
  ];

  const [selectedSage, setSelectedSage] = useState(sageOptions[0]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const handleAddChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddChat();
  };

  return (
    <aside className="w-64 bg-white text-primary h-full flex flex-col shadow-md">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <StructuralSageIcon className="h-8 w-8 text-primary" />
            <span className="text-2xl font-extrabold">Structural Sage</span>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="sage-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Your Sage
          </label>
          <select
            id="sage-select"
            value={selectedSage}
            onChange={(e) => setSelectedSage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            {sageOptions.map((sage) => (
              <option key={sage} value={sage}>
                {sage}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <button
            className="w-full p-2 rounded-lg flex items-center justify-between"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <span className="flex items-center">
              <Search className="mr-2" size={18} />
              Search
            </span>
            {isSearchOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {isSearchOpen && (
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 mt-2 rounded-lg border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
        </div>

        <BoardList
          boards={boards}
          activeBoard={activeBoard}
          setActiveBoard={onBoardSelect}
          onAddBoard={onAddBoard}
          onRenameBoard={onEditBoard}
          onDeleteBoard={onDeleteBoard}
        />

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <button
              className="w-full p-2 rounded-lg flex items-center justify-between"
              onClick={() => setIsChatHistoryOpen(!isChatHistoryOpen)}
            >
              <span>Chat History</span>
              {isChatHistoryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <button
              onClick={handleAddChat}
              className="p-1 rounded-full bg-gray-200 text-primary hover:bg-gray-300 transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
          {isChatHistoryOpen && (
            <div className="mt-2 max-h-40 overflow-y-auto">
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id} 
                  className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                  onClick={() => onSelectChat(conversation.id)}
                >
                  <p className="text-sm font-semibold">
                    {formatDate(new Date(conversation.lastTimestamp))}
                  </p>
                  <p className="text-sm truncate">
                    {conversation.messages[conversation.messages.length - 1]?.content || "New Chat"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto p-4">
        <button className="w-full text-left p-2 hover:bg-gray-100 rounded-lg">Profile</button>
        <button className="w-full text-left p-2 hover:bg-gray-100 rounded-lg">Settings</button>
      </div>
    </aside>
  );
};

export default Sidebar;