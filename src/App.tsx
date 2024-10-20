import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import KanbanBoard from './components/KanbanBoard';
import ErrorBoundary from './components/ErrorBoundary';

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

const App: React.FC = () => {
  const [view, setView] = useState<'kanban' | 'chat'>('kanban');
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  useEffect(() => {
    const savedBoards = localStorage.getItem('kanbanBoards');
    const savedConversations = localStorage.getItem('chatConversations');
    if (savedBoards) {
      const parsedBoards = JSON.parse(savedBoards);
      setBoards(parsedBoards);
      setActiveBoard(parsedBoards[0]?.id || null);
    } else {
      const defaultBoards: Board[] = [
        {
          id: uuidv4(),
          name: 'Board A',
          columns: {
            'inbox': { id: 'inbox', title: 'Inbox', tasks: [{ id: uuidv4(), content: 'Task 1 for Board A' }] },
            'todo': { id: 'todo', title: 'To Do', tasks: [] },
            'inProgress': { id: 'inProgress', title: 'In Progress', tasks: [] },
            'done': { id: 'done', title: 'Done', tasks: [] },
          }
        },
        {
          id: uuidv4(),
          name: 'Board B',
          columns: {
            'inbox': { id: 'inbox', title: 'Inbox', tasks: [{ id: uuidv4(), content: 'Task 1 for Board B' }] },
            'todo': { id: 'todo', title: 'To Do', tasks: [] },
            'inProgress': { id: 'inProgress', title: 'In Progress', tasks: [] },
            'done': { id: 'done', title: 'Done', tasks: [] },
          }
        }
      ];
      setBoards(defaultBoards);
      setActiveBoard(defaultBoards[0].id);
      localStorage.setItem('kanbanBoards', JSON.stringify(defaultBoards));
    }
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kanbanBoards', JSON.stringify(boards));
  }, [boards]);

  useEffect(() => {
    localStorage.setItem('chatConversations', JSON.stringify(conversations));
  }, [conversations]);

  const addBoard = () => {
    const newBoard: Board = {
      id: uuidv4(),
      name: `New Board ${boards.length + 1}`,
      columns: {
        'inbox': { id: 'inbox', title: 'Inbox', tasks: [] },
        'todo': { id: 'todo', title: 'To Do', tasks: [] },
        'inProgress': { id: 'inProgress', title: 'In Progress', tasks: [] },
        'done': { id: 'done', title: 'Done', tasks: [] },
      }
    };
    setBoards(prevBoards => [...prevBoards, newBoard]);
    setActiveBoard(newBoard.id);
    setView('kanban');
  };

  const editBoard = (boardId: string, newName: string) => {
    setBoards(prevBoards => prevBoards.map(board =>
      board.id === boardId ? { ...board, name: newName } : board
    ));
  };

  const deleteBoard = (boardId: string) => {
    setBoards(prevBoards => prevBoards.filter(board => board.id !== boardId));
    if (activeBoard === boardId) {
      setActiveBoard(boards.length > 1 ? boards[0].id : null);
    }
  };

  const updateBoard = (updatedBoard: Board) => {
    setBoards(prevBoards => prevBoards.map(board =>
      board.id === updatedBoard.id ? updatedBoard : board
    ));
  };

  const addChatMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      content: message,
      timestamp: new Date(),
    };

    setConversations(prevConversations => {
      const now = new Date();
      const lastConversation = prevConversations[prevConversations.length - 1];
      
      if (lastConversation && now.getTime() - new Date(lastConversation.lastTimestamp).getTime() < 5 * 60 * 1000) {
        const updatedConversation = {
          ...lastConversation,
          messages: [...lastConversation.messages, newMessage],
          lastTimestamp: now,
        };
        return [...prevConversations.slice(0, -1), updatedConversation];
      } else {
        const newConversation: Conversation = {
          id: uuidv4(),
          messages: [newMessage],
          lastTimestamp: now,
        };
        return [...prevConversations, newConversation];
      }
    });
  };

  const splitTextToCards = (text: string) => {
    if (activeBoard) {
      const updatedBoard = boards.find(b => b.id === activeBoard);
      if (updatedBoard) {
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim() !== '');
        const newTasks = sentences.map(sentence => ({
          id: uuidv4(),
          content: sentence.trim()
        }));
        
        const newColumns = {
          ...updatedBoard.columns,
          'inbox': {
            ...updatedBoard.columns['inbox'],
            tasks: [...updatedBoard.columns['inbox'].tasks, ...newTasks]
          }
        };
        
        const newBoard = { ...updatedBoard, columns: newColumns };
        updateBoard(newBoard);
      }
    }
  };

  const setActiveBoardAndView = (boardId: string) => {
    setActiveBoard(boardId);
    setView('kanban');
  };

  const addChat = () => {
    const newConversation: Conversation = {
      id: uuidv4(),
      messages: [],
      lastTimestamp: new Date(),
    };
    setConversations(prevConversations => [...prevConversations, newConversation]);
    setActiveConversation(newConversation.id);
    setView('chat');
  };

  const selectChat = (conversationId: string) => {
    setActiveConversation(conversationId);
    setView('chat');
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-background">
        <Sidebar
          boards={boards}
          activeBoard={activeBoard}
          onBoardSelect={setActiveBoardAndView}
          onAddBoard={addBoard}
          onEditBoard={editBoard}
          onDeleteBoard={deleteBoard}
          conversations={conversations}
          onAddChat={addChat}
          onSelectChat={selectChat}
        />
        <main className="flex-grow overflow-hidden">
          <div className="h-full transition-all duration-300 ease-in-out">
            {view === 'kanban' && activeBoard && (
              <KanbanBoard
                board={boards.find(b => b.id === activeBoard)!}
                updateBoard={updateBoard}
              />
            )}
            {view === 'chat' && (
              <ChatWindow
                conversations={conversations}
                activeConversation={activeConversation}
                addChatMessage={addChatMessage}
                splitTextToCards={splitTextToCards}
              />
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;