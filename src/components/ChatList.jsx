import { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaUser, 
  FaArrowLeft, 
  FaArrowRight, 
  FaTimes,
  FaEllipsisV,
  FaPlus,
  FaStar,
  FaHeart
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for chats
const defaultChats = [
  { id: 1, name: 'John Doe', lastMessage: 'Sure, I\'ll send you the document shortly.', time: '10:35 AM', unread: 2 },
  { id: 2, name: 'Jane Smith', lastMessage: 'Did you finish that project?', time: '9:47 AM', unread: 0 },
  { id: 3, name: 'Mike Johnson', lastMessage: 'Let\'s meet tomorrow!', time: '3:31 PM', unread: 3 },
  { id: 4, name: 'Sarah Williams', lastMessage: 'Thanks for your help!', time: '11:25 AM', unread: 0 },
  { id: 5, name: 'David Brown', lastMessage: 'Can you share that document?', time: '2:20 PM', unread: 1 },
  { id: 6, name: 'Emma Davis', lastMessage: 'Did you see the news?', time: '5:12 PM', unread: 0 },
  { id: 7, name: 'James Wilson', lastMessage: 'Happy birthday!', time: '9:10 AM', unread: 0 },
];

function ChatList({ chats = defaultChats, selectedChats, onChatSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState(chats);
  const [hoveredChat, setHoveredChat] = useState(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(null);
  const [priorities, setPriorities] = useState({
    1: 'main', // Default Sophia as main
    4: 'favorite', // Isabella as favorite
  });
  const [showAddChat, setShowAddChat] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchQuery, chats]);
  
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenuVisible(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleChatSelect = (chat) => {
    onChatSelect(chat, 'auto');
  };
  
  const handleLeftClick = (e, chat) => {
    e.stopPropagation();
    onChatSelect(chat, 'left');
  };
  
  const handleRightClick = (e, chat) => {
    e.stopPropagation();
    onChatSelect(chat, 'right');
  };
  
  const handleRemoveChat = (e, position) => {
    e.stopPropagation();
    onChatSelect(null, `remove-${position}`);
  };
  
  const toggleContextMenu = (e, chatId) => {
    e.stopPropagation();
    e.preventDefault();
    setContextMenuVisible(contextMenuVisible === chatId ? null : chatId);
  };
  
  const togglePriority = (e, chatId, priority) => {
    e.stopPropagation();
    setPriorities(prev => {
      const newPriorities = {...prev};
      
      if (newPriorities[chatId] === priority) {
        delete newPriorities[chatId];
      } else {
        newPriorities[chatId] = priority;
      }
      
      return newPriorities;
    });
    
    setContextMenuVisible(null);
  };
  
  const getPriorityLabel = (chatId) => {
    if (!priorities[chatId]) return null;
    
    if (priorities[chatId] === 'main') {
      return <span className="priority-label main"><FaHeart /> Main</span>;
    } else if (priorities[chatId] === 'favorite') {
      return <span className="priority-label favorite"><FaStar /> Favorite</span>;
    }
    
    return null;
  };
  
  // Generate initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  // Get a consistent color based on chat ID
  const getAvatarColorClass = (id) => {
    return `color-${(id % 7) + 1}`;
  };
  
  const getSelectionStatus = (chat) => {
    if (selectedChats.left && selectedChats.left.id === chat.id) return 'selected-left';
    if (selectedChats.right && selectedChats.right.id === chat.id) return 'selected-right';
    return '';
  };
  
  const handleAddNewContact = () => {
    if (newContact.name.trim() === '') return;
    
    // Create a new chat with a unique ID
    const newId = Math.max(...chats.map(chat => chat.id)) + 1;
    const newChat = {
      id: newId,
      name: newContact.name,
      lastMessage: 'New conversation started',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: 0
    };
    
    // Add to chat list - this requires modifying the parent state too
    // In a real app, this would call an API endpoint
    const updatedChats = [...chats, newChat];
    // For this prototype, we'll dispatch an event that App.js can listen to
    window.dispatchEvent(new CustomEvent('add-new-chat', { detail: newChat }));
    
    // Reset form and close it
    setNewContact({ name: '', phone: '' });
    setShowAddChat(false);
  };
  
  return (
    <div className="chat-list-container">
      <div className="chat-list-header">
        <h2>Conversations</h2>
        <button className="text-button">
          Options
        </button>
      </div>
      
      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      
      <div className="chat-management-info">
        <div className="management-tip">
          <FaHeart className="tip-icon heart" /> = Main GF
        </div>
        <div className="management-tip">
          <FaStar className="tip-icon star" /> = Favorite
        </div>
      </div>
      
      <div className="chat-list">
        {filteredChats.length === 0 ? (
          <div className="no-results">
            <p>No chats found</p>
          </div>
        ) : (
          filteredChats.map(chat => {
            const selectionStatus = getSelectionStatus(chat);
            const isSelected = selectionStatus !== '';
            
            return (
              <motion.div
                key={chat.id}
                className={`chat-item ${selectionStatus} ${contextMenuVisible === chat.id ? 'show-context' : ''}`}
                data-position={selectionStatus === 'selected-left' ? 'left' : selectionStatus === 'selected-right' ? 'right' : ''}
                onClick={() => handleChatSelect(chat)}
                onMouseEnter={() => setHoveredChat(chat.id)}
                onMouseLeave={() => setHoveredChat(null)}
                onContextMenu={(e) => toggleContextMenu(e, chat.id)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`chat-avatar ${getAvatarColorClass(chat.id)}`}>
                  {getInitials(chat.name)}
                  {priorities[chat.id] && (
                    <div className={`priority-indicator ${priorities[chat.id]}`}>
                      {priorities[chat.id] === 'main' ? <FaHeart size={10} /> : <FaStar size={10} />}
                    </div>
                  )}
                </div>
                
                <div className="chat-info">
                  <h3>{chat.name} {getPriorityLabel(chat.id)}</h3>
                  <p>{chat.lastMessage}</p>
                </div>
                
                <div className="chat-meta">
                  <span className="chat-time">{chat.time}</span>
                  {chat.unread > 0 && (
                    <span className="chat-badge">{chat.unread}</span>
                  )}
                </div>
                
                <div className="chat-actions">
                  {(!selectedChats.left || (selectedChats.left && selectedChats.left.id !== chat.id)) && (
                    <button 
                      className="action-btn left-btn"
                      onClick={(e) => handleLeftClick(e, chat)}
                      title="Add to left panel"
                    >
                      Left
                    </button>
                  )}
                  
                  {(!selectedChats.right || (selectedChats.right && selectedChats.right.id !== chat.id)) && (
                    <button 
                      className="action-btn right-btn"
                      onClick={(e) => handleRightClick(e, chat)}
                      title="Add to right panel"
                    >
                      Right
                    </button>
                  )}
                  
                  {selectedChats.left && selectedChats.left.id === chat.id && (
                    <button 
                      className="action-btn close-btn"
                      onClick={(e) => handleRemoveChat(e, 'left')}
                      title="Remove from left panel"
                    >
                      Close
                    </button>
                  )}
                  
                  {selectedChats.right && selectedChats.right.id === chat.id && (
                    <button 
                      className="action-btn close-btn"
                      onClick={(e) => handleRemoveChat(e, 'right')}
                      title="Remove from right panel"
                    >
                      Close
                    </button>
                  )}
                  
                  <button 
                    className="action-btn menu-btn"
                    onClick={(e) => toggleContextMenu(e, chat.id)}
                    title="Menu options"
                  >
                    Menu
                  </button>
                </div>
                
                {contextMenuVisible === chat.id && (
                  <div className="chat-context-menu" onClick={(e) => e.stopPropagation()}>
                    <div className="context-menu-options">
                      <button 
                        className={`context-option ${priorities[chat.id] === 'main' ? 'active' : ''}`}
                        onClick={(e) => togglePriority(e, chat.id, 'main')}
                      >
                        <FaHeart size={14} />
                        <span>Main GF</span>
                      </button>
                      <button 
                        className={`context-option ${priorities[chat.id] === 'favorite' ? 'active' : ''}`}
                        onClick={(e) => togglePriority(e, chat.id, 'favorite')}
                      >
                        <FaStar size={14} />
                        <span>Favorite</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
      
      <div className="new-chat-button">
        <button 
          className="icon-button new-chat"
          onClick={() => setShowAddChat(true)}
        >
          <FaPlus />
        </button>
      </div>
      
      <AnimatePresence>
        {showAddChat && (
          <motion.div 
            className="add-chat-modal"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              // Close if clicking the background overlay
              if (e.target.classList.contains('add-chat-modal')) {
                setShowAddChat(false);
              }
            }}
          >
            <div className="add-chat-form">
              <h3>Add New Girlfriend</h3>
              
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  placeholder="Her name..."
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Phone (optional)</label>
                <input 
                  type="text" 
                  placeholder="Phone number..."
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                />
              </div>
              
              <div className="form-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowAddChat(false)}
                >
                  Cancel
                </button>
                <button 
                  className="add-btn"
                  onClick={handleAddNewContact}
                >
                  Add Contact
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx>{`
        .chat-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
        }
        
        .chat-list-header h2 {
          font-size: 1.1rem;
          font-weight: 500;
          margin: 0;
          color: var(--primary-text);
        }
        
        .no-results {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
          color: var(--secondary-text);
          font-size: 0.9rem;
        }
        
        .new-chat-button {
          position: absolute;
          bottom: 16px;
          right: 16px;
          z-index: 5;
        }
        
        .new-chat {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s;
        }
        
        .new-chat:hover {
          transform: scale(1.05);
        }
        
        .chat-management-info {
          display: flex;
          justify-content: space-around;
          padding: 8px 10px;
          background-color: rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid var(--border-color);
        }
        
        .management-tip {
          display: flex;
          align-items: center;
          font-size: 0.8rem;
          color: var(--secondary-text);
        }
        
        .tip-icon {
          margin-right: 4px;
        }
        
        .tip-icon.heart {
          color: #ff6b6b;
        }
        
        .tip-icon.star {
          color: #ffd43b;
        }
        
        .priority-label {
          display: inline-flex;
          align-items: center;
          font-size: 0.7rem;
          font-weight: normal;
          padding: 2px 5px;
          border-radius: 10px;
          margin-left: 5px;
        }
        
        .priority-label.main {
          background-color: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
        }
        
        .priority-label.favorite {
          background-color: rgba(255, 212, 59, 0.2);
          color: #ffd43b;
        }
        
        .priority-label svg {
          margin-right: 3px;
          font-size: 0.7rem;
        }
        
        .priority-btn {
          background-color: #3a3a3a !important;
        }
        
        .chat-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 500;
          font-size: 1.2rem;
          margin-right: 14px;
          flex-shrink: 0;
        }
        
        .priority-indicator {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--panel-bg);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .priority-indicator.main {
          background-color: #ff6b6b;
          color: white;
        }
        
        .priority-indicator.favorite {
          background-color: #ffd43b;
          color: #333;
        }
        
        .chat-item {
          position: relative;
        }
        
        .chat-item .chat-context-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background-color: #1A1A1A;
          z-index: 10;
          border-top: 1px solid var(--border-color);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .chat-item.show-context {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .menu-btn {
          background-color: transparent !important;
        }
        
        .context-menu-options {
          display: flex;
          padding: 5px;
        }
        
        .context-option {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: var(--primary-text);
          padding: 8px;
          cursor: pointer;
          border-radius: 4px;
        }
        
        .context-option span {
          font-size: 0.7rem;
          margin-top: 4px;
        }
        
        .context-option:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .context-option.active {
          background-color: rgba(0, 191, 165, 0.1);
        }
        
        .context-option.active:first-child {
          color: #ff6b6b;
        }
        
        .context-option.active:last-child {
          color: #ffd43b;
        }
        
        .add-chat-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
        }
        
        .add-chat-form {
          background-color: var(--panel-bg);
          border-radius: 12px;
          padding: 20px;
          width: 100%;
          max-width: 320px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-color);
        }
        
        .add-chat-form h3 {
          margin-top: 0;
          margin-bottom: 16px;
          color: var(--primary);
          font-weight: 500;
          font-size: 18px;
          text-align: center;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group label {
          display: block;
          font-size: 14px;
          color: var(--secondary-text);
          margin-bottom: 6px;
        }
        
        .form-group input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--primary-text);
          font-size: 14px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        
        .cancel-btn {
          padding: 8px 16px;
          background-color: rgba(244, 67, 54, 0.1);
          color: #ff6b6b;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        
        .add-btn {
          padding: 8px 16px;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        
        .add-btn:hover {
          background-color: var(--primary-light);
        }
      `}</style>
    </div>
  );
}

export default ChatList; 