import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaPaperPlane, 
  FaEllipsisV, 
  FaSmile, 
  FaPaperclip, 
  FaMicrophone,
  FaImage,
  FaFile,
  FaCamera,
  FaCommentAlt,
  FaReply,
  FaVolumeUp,
  FaSearch,
  FaThumbsUp,
  FaHeart,
  FaLaugh,
  FaTimes
} from 'react-icons/fa';
import { BsCheck, BsCheckAll, BsPinAngle } from 'react-icons/bs';

// Common emojis for the picker
const EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', 
  '😉', '😊', '😇', '😍', '🥰', '😘', '😗', '😚', '😙', '😋', 
  '😛', '😜', '😝', '🤑', '🤗', '🤔', '🤐', '😐', '😑', '😶', 
  '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴',
  '👍', '👎', '👌', '✌️', '🤞', '🤘', '🤙', '👋', '❤️', '💯'
];

// Reaction options
const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

// Mock messages for each chat
const mockMessages = {
  1: [
    { id: 1, text: 'Hey Sophia, miss you!', sender: 'me', timestamp: '10:28 AM', date: 'Today', status: 'read' },
    { id: 2, text: 'Miss you! When are we meeting next?', sender: 'them', timestamp: '10:30 AM', date: 'Today' },
    { id: 3, text: 'I was thinking Friday night? Dinner at that place you love?', sender: 'me', timestamp: '10:31 AM', date: 'Today', status: 'read', reactions: ['❤️'] },
    { id: 4, text: 'That sounds perfect! Can\'t wait to see you', sender: 'them', timestamp: '10:32 AM', date: 'Today' },
    { id: 5, text: 'I\'ll make the reservation for 8pm', sender: 'me', timestamp: '10:33 AM', date: 'Today', status: 'delivered' },
    { id: 6, type: 'image', imageUrl: 'https://via.placeholder.com/200x150', sender: 'me', timestamp: '10:35 AM', date: 'Today', status: 'sent' },
    { id: 7, text: 'Aww, is that the gift you mentioned? So thoughtful!', sender: 'them', timestamp: '10:40 AM', date: 'Today', replyTo: 6 },
  ],
  2: [
    { id: 1, text: 'Hi Emma, did you receive my package?', sender: 'me', timestamp: '9:40 AM', date: 'Today', status: 'read' },
    { id: 2, text: 'Did you get the gift I sent you?', sender: 'them', timestamp: '9:42 AM', date: 'Today' },
    { id: 3, text: 'Yes! Just opened it, it\'s beautiful!', sender: 'me', timestamp: '9:45 AM', date: 'Today', status: 'read' },
    { id: 4, type: 'image', imageUrl: 'https://via.placeholder.com/200x150', sender: 'them', timestamp: '9:47 AM', date: 'Today' },
  ],
  3: [
    { id: 1, text: 'Olivia, are we still on for tomorrow?', sender: 'me', timestamp: '3:28 PM', date: 'Yesterday', status: 'read' },
    { id: 2, text: 'Yes, I\'ve been looking forward to it all week!', sender: 'them', timestamp: '3:30 PM', date: 'Yesterday' },
    { id: 3, text: 'Can\'t wait to see you tomorrow!', sender: 'them', timestamp: '3:31 PM', date: 'Yesterday' },
  ],
  4: [
    { id: 1, text: 'Isabella, did you see the photos from our beach trip?', sender: 'me', timestamp: '11:20 AM', date: 'Yesterday', status: 'read' },
    { id: 2, text: 'Thinking about you... ❤️', sender: 'them', timestamp: '11:22 AM', date: 'Yesterday' },
    { id: 3, text: 'Thinking about you too! Those were amazing days.', sender: 'me', timestamp: '11:25 AM', date: 'Yesterday', status: 'read' },
  ],
  5: [
    { id: 1, text: 'Ava, did you like the flowers?', sender: 'me', timestamp: '2:15 PM', date: 'Monday', status: 'read' },
    { id: 2, text: 'I love the flowers you sent!', sender: 'them', timestamp: '2:17 PM', date: 'Monday' },
    { id: 3, text: 'I\'m glad you liked them! Wanted to make your day special.', sender: 'me', timestamp: '2:20 PM', date: 'Monday', status: 'read' },
  ],
  6: [
    { id: 1, text: 'Mia, are we meeting at the restaurant or should I pick you up?', sender: 'me', timestamp: '5:05 PM', date: 'Sunday', status: 'read' },
    { id: 2, text: 'Should I wear the red dress tonight?', sender: 'them', timestamp: '5:10 PM', date: 'Sunday' },
    { id: 3, text: 'You look amazing in that dress! And I\'ll pick you up at 7.', sender: 'me', timestamp: '5:12 PM', date: 'Sunday', status: 'read' },
  ],
  7: [
    { id: 1, text: 'Charlotte, our date night was perfect!', sender: 'me', timestamp: '9:00 AM', date: 'Last week', status: 'read' },
    { id: 2, text: 'Missing our date night already!', sender: 'them', timestamp: '9:05 AM', date: 'Last week' },
    { id: 3, text: 'Let\'s do it again soon! How about Saturday?', sender: 'me', timestamp: '9:10 AM', date: 'Last week', status: 'read' },
  ]
};

// Add more emoji categories to improve organization
const EMOJI_CATEGORIES = {
  "Smileys": ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '😍', '🥰', '😘', '😗', '😚', '😙'],
  "Hands": ['👍', '👎', '👌', '✌️', '🤞', '🤘', '🤙', '👋', '👏', '🙌', '🤝', '💪', '🫶', '🤲', '🫴', '👐'],
  "Hearts": ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
  "Symbols": ['😎', '🔥', '⭐', '✨', '💯', '💤', '❓', '❗', '💬', '👁️‍🗨️', '🗯️', '💭', '🕒', '��', '⚠️', '📢']
};

function ChatWindow({ chat }) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showReactions, setShowReactions] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showGiftIdeas, setShowGiftIdeas] = useState(false);
  const [giftIdeas, setGiftIdeas] = useState(() => {
    // Load saved gift ideas from localStorage if available
    const savedIdeas = localStorage.getItem(`gift-ideas-${chat.id}`);
    return savedIdeas ? JSON.parse(savedIdeas) : [
      { id: 1, idea: "Favorite perfume", occasion: "Birthday" },
      { id: 2, idea: "Matching bracelets", occasion: "Anniversary" }
    ];
  });
  const [newGiftIdea, setNewGiftIdea] = useState({ idea: '', occasion: '' });
  const [showKeyDates, setShowKeyDates] = useState(false);
  const [keyDates, setKeyDates] = useState(() => {
    // Load saved key dates from localStorage if available
    const savedDates = localStorage.getItem(`key-dates-${chat.id}`);
    return savedDates ? JSON.parse(savedDates) : [
      { id: 1, event: "Birthday", date: "May 15, 1998", nextDate: "May 15, 2024" },
      { id: 2, event: "First Date Anniversary", date: "Oct 10, 2022", nextDate: "Oct 10, 2024" }
    ];
  });
  const [newKeyDate, setNewKeyDate] = useState({ event: '', date: '', nextDate: '' });
  const messagesEndRef = useRef(null);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState("Smileys");
  
  useEffect(() => {
    // Load messages for the selected chat
    if (chat && chat.id) {
      setMessages(mockMessages[chat.id] || []);
      
      // Simulate the other person typing for chats with ID 1 or 2
      if (chat.id === 1 || chat.id === 2) {
        const typingTimer = setTimeout(() => {
          setIsTyping(true);
          
          // Stop typing after 3 seconds
          setTimeout(() => {
            setIsTyping(false);
            
            // Add a new message from them
            if (chat.id === 1) {
              const newMsg = {
                id: Date.now(),
                text: 'Let me know when you can meet to discuss it',
                sender: 'them',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: 'Today'
              };
              setMessages(prev => [...prev, newMsg]);
            }
          }, 3000);
        }, 1500);
        
        return () => clearTimeout(typingTimer);
      }
    }
  }, [chat]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' && !isRecording) return;
    
    let newMsg = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      status: 'sent'
    };
    
    // If replying to a message
    if (replyingTo) {
      newMsg.replyTo = replyingTo.id;
    }
    
    // If recording a voice note
    if (isRecording) {
      newMsg = {
        ...newMsg,
        type: 'voice',
        duration: `${recordingSeconds}s`,
        text: null
      };
      setIsRecording(false);
      setRecordingSeconds(0);
    }
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    setReplyingTo(null);
    
    // Simulate message status updates
    setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === newMsg.id ? { ...msg, status: 'delivered' } : msg
        )
      );
      
      // Simulate read status after 2 more seconds
      setTimeout(() => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === newMsg.id ? { ...msg, status: 'read' } : msg
          )
        );
        
        // Simulate typing response if it's chat with ID 1
        if (chat.id === 1) {
          setIsTyping(true);
          
          setTimeout(() => {
            setIsTyping(false);
            
            const replyMsg = {
              id: Date.now(),
              text: 'Got it! Thanks for the update.',
              sender: 'them',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              date: 'Today'
            };
            
            setMessages(prev => [...prev, replyMsg]);
          }, 3000);
        }
      }, 2000);
    }, 1000);
  };
  
  const addEmoji = (emoji) => {
    setNewMessage(prevMessage => prevMessage + emoji);
  };
  
  const handleAttachment = (type) => {
    const attachmentTypes = {
      image: { type: 'image', imageUrl: 'https://via.placeholder.com/200x150' },
      file: { type: 'file', fileName: 'Document.pdf', fileSize: '1.2 MB' },
      camera: { type: 'image', imageUrl: 'https://via.placeholder.com/200x150' }
    };
    
    const newMsg = {
      id: Date.now(),
      ...attachmentTypes[type],
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      status: 'sent'
    };
    
    setMessages([...messages, newMsg]);
    setShowAttachments(false);
    
    // Simulate status updates for attachments
    setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === newMsg.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1500);
  };
  
  const addReaction = (messageId, reaction) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          // Toggle reaction
          if (reactions.includes(reaction)) {
            return { ...msg, reactions: reactions.filter(r => r !== reaction) };
          } else {
            return { ...msg, reactions: [...reactions, reaction] };
          }
        }
        return msg;
      })
    );
    setShowReactions(null);
  };

  const startReply = (message) => {
    setReplyingTo(message);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };
  
  const startRecording = () => {
    setIsRecording(true);
    const interval = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
    
    // Store the interval ID to clear it later
    window.recordingInterval = interval;
  };
  
  const stopRecording = () => {
    clearInterval(window.recordingInterval);
    sendMessage({ preventDefault: () => {} });
  };
  
  const toggleSearch = () => {
    setSearchActive(!searchActive);
    if (searchActive) {
      setSearchTerm('');
    }
  };

  const filteredMessages = searchActive && searchTerm 
    ? messages.filter(msg => msg.text && msg.text.toLowerCase().includes(searchTerm.toLowerCase()))
    : messages;
  
  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  // Render message status indicator
  const renderMessageStatus = (status) => {
    switch(status) {
      case 'sent':
        return <BsCheck className="status-icon" />;
      case 'delivered':
        return <BsCheckAll className="status-icon" />;
      case 'read':
        return <BsCheckAll className="status-icon read" />;
      default:
        return null;
    }
  };
  
  // Render message content based on type
  const renderMessageContent = (message) => {
    // If this message is a reply, show the replied-to message
    const replyElement = message.replyTo && (
      <div className="reply-container">
        <div className="reply-content">
          {renderReplyPreview(findMessageById(message.replyTo))}
        </div>
      </div>
    );
    
    let mainContent;
    switch(message.type) {
      case 'image':
        mainContent = (
          <div className="image-attachment">
            <img src={message.imageUrl} alt="Attachment" />
          </div>
        );
        break;
      case 'file':
        mainContent = (
          <div className="file-attachment">
            <FaFile className="file-icon" />
            <div className="file-info">
              <span className="file-name">{message.fileName}</span>
              <span className="file-size">{message.fileSize}</span>
            </div>
          </div>
        );
        break;
      case 'voice':
        mainContent = (
          <div className="voice-attachment">
            <FaVolumeUp className="voice-icon" />
            <div className="voice-player">
              <div className="voice-waveform"></div>
              <span className="voice-duration">{message.duration}</span>
            </div>
          </div>
        );
        break;
      default:
        mainContent = <p>{message.text}</p>;
    }
    
    // Show reactions if any
    const reactions = message.reactions && message.reactions.length > 0 && (
      <div className="message-reactions">
        {message.reactions.map((reaction, index) => (
          <span key={index} className="reaction">{reaction}</span>
        ))}
      </div>
    );
    
    return (
      <>
        {replyElement}
        {mainContent}
        {reactions}
      </>
    );
  };
  
  const renderReplyPreview = (replyMsg) => {
    if (!replyMsg) return <p>Message not found</p>;
    
    let content;
    if (replyMsg.type === 'image') {
      content = <div className="reply-preview-image"><FaImage size={12} /> Photo</div>;
    } else if (replyMsg.type === 'file') {
      content = <div className="reply-preview-file"><FaFile size={12} /> {replyMsg.fileName}</div>;
    } else if (replyMsg.type === 'voice') {
      content = <div className="reply-preview-voice"><FaVolumeUp size={12} /> Voice message ({replyMsg.duration})</div>;
    } else {
      content = <p className="reply-text">{replyMsg.text}</p>;
    }
    
    return (
      <>
        <div className="reply-sender">{replyMsg.sender === 'me' ? 'You' : chat.name}</div>
        {content}
      </>
    );
  };
  
  // Find a message by ID
  const findMessageById = (id) => {
    return messages.find(msg => msg.id === id);
  };
  
  // Add function to save gift ideas
  const addGiftIdea = () => {
    if (newGiftIdea.idea.trim() === '') return;
    
    const updatedIdeas = [
      ...giftIdeas,
      { 
        id: Date.now(), 
        idea: newGiftIdea.idea, 
        occasion: newGiftIdea.occasion 
      }
    ];
    
    setGiftIdeas(updatedIdeas);
    setNewGiftIdea({ idea: '', occasion: '' });
    
    // Save to localStorage
    localStorage.setItem(`gift-ideas-${chat.id}`, JSON.stringify(updatedIdeas));
  };
  
  const removeGiftIdea = (ideaId) => {
    const updatedIdeas = giftIdeas.filter(idea => idea.id !== ideaId);
    setGiftIdeas(updatedIdeas);
    
    // Update localStorage
    localStorage.setItem(`gift-ideas-${chat.id}`, JSON.stringify(updatedIdeas));
  };
  
  // Add function to save key dates
  const addKeyDate = () => {
    if (newKeyDate.event.trim() === '' || newKeyDate.date.trim() === '') return;
    
    // Calculate next anniversary date (for next year)
    let nextDate = '';
    try {
      const dateObj = new Date(newKeyDate.date);
      if (!isNaN(dateObj.getTime())) {
        const nextYear = new Date().getFullYear() + 1;
        dateObj.setFullYear(nextYear);
        nextDate = dateObj.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
    } catch (e) {
      nextDate = '';
    }
    
    const updatedDates = [
      ...keyDates,
      { 
        id: Date.now(), 
        event: newKeyDate.event, 
        date: newKeyDate.date,
        nextDate: nextDate || newKeyDate.nextDate
      }
    ];
    
    setKeyDates(updatedDates);
    setNewKeyDate({ event: '', date: '', nextDate: '' });
    
    // Save to localStorage
    localStorage.setItem(`key-dates-${chat.id}`, JSON.stringify(updatedDates));
  };
  
  const removeKeyDate = (dateId) => {
    const updatedDates = keyDates.filter(date => date.id !== dateId);
    setKeyDates(updatedDates);
    
    // Update localStorage
    localStorage.setItem(`key-dates-${chat.id}`, JSON.stringify(updatedDates));
  };
  
  // Add this for close button
  const closeEmojiPicker = () => {
    setShowEmojiPicker(false);
  };
  
  if (!chat) {
    return (
      <div className="chat-window">
        <div className="messages-container">
          <div className="empty-chat">
            <div className="empty-chat-icon">
              <FaCommentAlt size={48} />
            </div>
            <h3>Select a chat to start messaging</h3>
            <p>Choose contacts from the list to start conversations. You can chat with multiple people at once by selecting chats for the left and right panels.</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Generate initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  // Get a consistent color based on chat ID
  const getAvatarColorClass = (id) => {
    return `color-${(id % 7) + 1}`;
  };
  
  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-contact">
          <div className={`chat-avatar ${getAvatarColorClass(chat.id)}`}>
            {getInitials(chat.name)}
          </div>
          <div className="chat-contact-info">
            <h3>{chat.name}</h3>
            <span className="chat-status">
              <span className="status-dot"></span>
              Online
            </span>
          </div>
        </div>
        <div className="chat-header-actions">
          <button onClick={toggleSearch}>
            <FaSearch size={14} />
          </button>
          <button 
            className="text-button gift-btn" 
            onClick={() => {
              setShowGiftIdeas(!showGiftIdeas);
              setShowKeyDates(false);
            }}
            title="Gift Ideas"
          >
            Gift Ideas
          </button>
          <button 
            className="text-button key-dates-btn" 
            onClick={() => {
              setShowKeyDates(!showKeyDates);
              setShowGiftIdeas(false);
            }}
            title="Key Dates"
          >
            Key Dates
          </button>
        </div>
      </div>
      
      {searchActive && (
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search in conversation..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <button className="search-close" onClick={toggleSearch}>
            <FaTimes size={14} />
          </button>
        </div>
      )}
      
      {showGiftIdeas && (
        <div className="gift-ideas-container">
          <h4>Gift Ideas for {chat.name}</h4>
          
          <div className="gift-ideas-list">
            {giftIdeas.length === 0 ? (
              <p className="no-ideas">No gift ideas saved yet. Add some!</p>
            ) : (
              giftIdeas.map(idea => (
                <div key={idea.id} className="gift-idea-item">
                  <div className="gift-idea-content">
                    <div className="gift-idea-text">{idea.idea}</div>
                    <div className="gift-idea-occasion">{idea.occasion}</div>
                  </div>
                  <button 
                    className="remove-idea-btn" 
                    onClick={() => removeGiftIdea(idea.id)}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
          
          <div className="add-gift-idea">
            <input
              type="text"
              placeholder="Gift idea..."
              value={newGiftIdea.idea}
              onChange={(e) => setNewGiftIdea({...newGiftIdea, idea: e.target.value})}
            />
            <input
              type="text"
              placeholder="Occasion..."
              value={newGiftIdea.occasion}
              onChange={(e) => setNewGiftIdea({...newGiftIdea, occasion: e.target.value})}
            />
            <button onClick={addGiftIdea}>Add</button>
          </div>
        </div>
      )}
      
      {showKeyDates && (
        <div className="key-dates-container">
          <h4>Important Dates for {chat.name}</h4>
          
          <div className="key-dates-list">
            {keyDates.length === 0 ? (
              <p className="no-dates">No important dates saved yet. Add some!</p>
            ) : (
              keyDates.map(date => (
                <div key={date.id} className="key-date-item">
                  <div className="key-date-content">
                    <div className="key-date-event">{date.event}</div>
                    <div className="key-date-details">
                      <span className="date-original">Original: {date.date}</span>
                      {date.nextDate && <span className="date-next">Next: {date.nextDate}</span>}
                    </div>
                  </div>
                  <button 
                    className="remove-date-btn" 
                    onClick={() => removeKeyDate(date.id)}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
          
          <div className="add-key-date">
            <input
              type="text"
              placeholder="Event (Birthday, Anniversary...)"
              value={newKeyDate.event}
              onChange={(e) => setNewKeyDate({...newKeyDate, event: e.target.value})}
            />
            <input
              type="text"
              placeholder="Date (May 15, 1998)"
              value={newKeyDate.date}
              onChange={(e) => setNewKeyDate({...newKeyDate, date: e.target.value})}
            />
            <button onClick={addKeyDate}>Add</button>
          </div>
        </div>
      )}
      
      <div className="messages-container">
        <div className="chat-messages">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="message-group">
              <div className="message-date">{date}</div>
              {dateMessages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${message.sender === 'me' ? 'sent' : 'received'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="message-content">
                    {renderMessageContent(message)}
                    <span className="message-time">
                      {message.timestamp}
                      {message.sender === 'me' && (
                        <span className="read-status">
                          {renderMessageStatus(message.status)}
                        </span>
                      )}
                    </span>
                    <div className="message-actions-menu">
                      <button 
                        className="message-action-btn" 
                        onClick={() => setShowReactions(message.id)}
                      >
                        <FaSmile size={12} style={{ color: '#FFFFFF' }} />
                      </button>
                      <button 
                        className="message-action-btn"
                        onClick={() => startReply(message)}
                      >
                        <FaReply size={12} style={{ color: '#FFFFFF' }} />
                      </button>
                    </div>
                    {showReactions === message.id && (
                      <div className="reaction-picker">
                        {REACTIONS.map((reaction, index) => (
                          <span 
                            key={index} 
                            className="reaction-option"
                            onClick={() => addReaction(message.id, reaction)}
                          >
                            {reaction}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
          
          {isTyping && (
            <motion.div
              className="typing-indicator-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="input-area">
        <AnimatePresence>
          {replyingTo && (
            <motion.div 
              className="reply-bar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="reply-preview">
                <div className="reply-preview-content">
                  {renderReplyPreview(replyingTo)}
                </div>
              </div>
              <button className="reply-close" onClick={cancelReply}>
                <FaTimes size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="message-input-container">
          <AnimatePresence>
            {showAttachments && (
              <motion.div 
                className="attachment-options"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <button className="attachment-btn" onClick={() => handleAttachment('image')}>
                  <FaImage style={{ color: '#FFFFFF' }} />
                  <span>Image</span>
                </button>
                <button className="attachment-btn" onClick={() => handleAttachment('file')}>
                  <FaFile style={{ color: '#FFFFFF' }} />
                  <span>Document</span>
                </button>
                <button className="attachment-btn" onClick={() => handleAttachment('camera')}>
                  <FaCamera style={{ color: '#FFFFFF' }} />
                  <span>Camera</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="message-actions">
            <button 
              className="message-action-btn"
              onClick={() => setShowAttachments(!showAttachments)}
            >
              <FaPaperclip style={{ color: '#FFFFFF' }} />
            </button>
          </div>
          
          <form className="message-input" onSubmit={sendMessage}>
            <button 
              type="button" 
              className="emoji-btn"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <FaSmile style={{ color: '#FFFFFF' }} />
            </button>
            
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isRecording}
            />
            
            {isRecording ? (
              <motion.div 
                className="recording-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="recording-pulse"></span>
                <span className="recording-time">{recordingSeconds}s</span>
                <button type="button" className="recording-stop" onClick={stopRecording}>
                  Send
                </button>
              </motion.div>
            ) : newMessage.trim() ? (
              <button type="submit" className="send-button">
                <FaPaperPlane size={14} style={{ color: '#FFFFFF' }} />
              </button>
            ) : (
              <button 
                type="button" 
                className="send-button mic-button"
                onTouchStart={startRecording}
                onMouseDown={startRecording}
                onTouchEnd={stopRecording}
                onMouseUp={stopRecording}
              >
                <FaMicrophone size={14} style={{ color: '#FFFFFF' }} />
                {/* SEND */}
              </button>
            )}
          </form>
          
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div 
                className="emoji-picker"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="emoji-picker-header">
                  <div className="emoji-categories">
                    {Object.keys(EMOJI_CATEGORIES).map(category => (
                      <button 
                        key={category}
                        className={`category-btn ${activeEmojiCategory === category ? 'active' : ''}`}
                        onClick={() => setActiveEmojiCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <button className="emoji-close-btn" onClick={closeEmojiPicker}>
                    <FaTimes size={14} />
                  </button>
                </div>
                <div className="emoji-list">
                  {EMOJI_CATEGORIES[activeEmojiCategory].map((emoji, index) => (
                    <div 
                      key={index} 
                      className="emoji-item"
                      onClick={() => addEmoji(emoji)}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <style jsx>{`
        .chat-window {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          background-color: var(--chat-bg);
        }
        
        .messages-container {
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        
        .chat-messages {
          height: 100%;
          overflow-y: auto;
          padding: 16px;
          background-image: var(--chat-bg-pattern);
        }
        
        .input-area {
          position: relative;
          margin-top: auto;
          background-color: var(--panel-bg);
          border-top: 1px solid var(--border-color);
        }
        
        .status-icon {
          font-size: 14px;
          margin-left: 3px;
        }
        
        .status-icon.read {
          color: #4FC3F7;
        }
        
        .typing-indicator-container {
          padding-left: 12px;
          margin-top: 5px;
        }
        
        .image-attachment {
          max-width: 200px;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 5px;
        }
        
        .image-attachment img {
          width: 100%;
          display: block;
        }
        
        .file-attachment {
          display: flex;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.05);
          padding: 8px 12px;
          border-radius: 4px;
          margin-bottom: 5px;
        }
        
        .file-icon {
          font-size: 24px;
          margin-right: 10px;
          color: #5E35B1;
        }
        
        .file-info {
          display: flex;
          flex-direction: column;
        }
        
        .file-name {
          font-weight: 500;
          font-size: 0.85rem;
        }
        
        .file-size {
          font-size: 0.7rem;
          color: var(--secondary-text);
        }
        
        .emoji-btn {
          background: none;
          border: none;
          color: var(--secondary-text);
          cursor: pointer;
          padding: 0 8px;
          font-size: 1.2rem;
        }
        
        .mic-button {
          background: var(--primary-gradient);
        }
        
        .attachment-options {
          display: flex;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 10px;
          position: absolute;
          bottom: 70px;
          left: 10px;
          z-index: 10;
        }
        
        .attachment-btn {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 15px;
          cursor: pointer;
          color: var(--secondary-text);
          transition: color 0.2s;
        }
        
        .attachment-btn:hover {
          color: var(--primary);
        }
        
        .attachment-btn svg {
          font-size: 20px;
          margin-bottom: 5px;
        }
        
        .attachment-btn span {
          font-size: 0.7rem;
        }
        
        .empty-container {
          width: 100%;
          height: 100%;
          background-color: white;
        }
        
        .empty-chat {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
          padding: 0 20px;
          text-align: center;
        }
        
        .empty-chat-icon {
          font-size: 4rem;
          color: var(--primary);
          opacity: 0.6;
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .message-input-container {
          width: 100%;
          padding: 10px;
          background-color: var(--panel-bg);
          border-top: 1px solid var(--border-color);
        }
        
        .message-input {
          display: flex;
          align-items: center;
          width: 100%;
          background-color: white;
          border-radius: 24px;
          overflow: hidden;
          padding: 4px 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .message-input input {
          flex: 1;
          border: none;
          outline: none;
          padding: 10px 12px;
          font-size: 0.95rem;
          background-color: transparent;
          color: #FFFFFF;
        }
        
        .message-input input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .chat-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
        }
        
        .message-actions-menu {
          position: absolute;
          right: -40px;
          top: 50%;
          transform: translateY(-50%);
          display: none;
          background: rgba(30, 30, 30, 0.9);
          border-radius: 16px;
          padding: 2px;
        }
        
        .message:hover .message-actions-menu {
          display: flex;
        }
        
        .message-action-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 2px;
        }
        
        .message-action-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .reaction-picker {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 8px;
          background-color: #232323;
          border-radius: 24px;
          padding: 6px 10px;
          display: flex;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
          z-index: 10;
        }
        
        .reaction-option {
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.2rem;
          cursor: pointer;
          border-radius: 50%;
          transition: transform 0.2s;
        }
        
        .reaction-option:hover {
          transform: scale(1.4);
        }
        
        .message-reactions {
          display: flex;
          margin-top: 4px;
        }
        
        .reaction {
          font-size: 0.9rem;
          background-color: rgba(255, 255, 255, 0.1);
          padding: 2px 5px;
          border-radius: 10px;
          margin-right: 4px;
        }
        
        .reply-container {
          background-color: rgba(255, 255, 255, 0.07);
          padding: 6px 8px;
          border-radius: 6px;
          margin-bottom: 5px;
          border-left: 2px solid var(--primary);
        }
        
        .reply-sender {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 2px;
        }
        
        .reply-text {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .reply-bar {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          background-color: #1A1A1A;
          border-top: 1px solid var(--border-color);
        }
        
        .reply-preview {
          flex: 1;
          display: flex;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.05);
          padding: 8px 12px;
          border-radius: 8px;
          margin-right: 10px;
          border-left: 2px solid var(--primary);
        }
        
        .reply-preview-content {
          font-size: 0.85rem;
          color: var(--secondary-text);
        }
        
        .reply-close {
          background: none;
          border: none;
          color: var(--secondary-text);
          cursor: pointer;
        }
        
        .recording-indicator {
          display: flex;
          align-items: center;
          margin-left: 10px;
          color: var(--primary);
        }
        
        .recording-pulse {
          width: 10px;
          height: 10px;
          background-color: #f04747;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 1.5s infinite;
        }
        
        .recording-time {
          font-size: 0.8rem;
          margin-right: 10px;
        }
        
        .recording-stop {
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 4px 10px;
          font-size: 0.7rem;
          cursor: pointer;
        }
        
        .voice-attachment {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
        }
        
        .voice-icon {
          font-size: 18px;
          color: var(--primary);
        }
        
        .voice-player {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .voice-waveform {
          width: 80px;
          height: 24px;
          background: linear-gradient(90deg, var(--primary) 0%, rgba(255,255,255,0.3) 100%);
          border-radius: 4px;
        }
        
        .voice-duration {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .reply-preview-image,
        .reply-preview-file,
        .reply-preview-voice {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
        }
        
        .search-container {
          display: flex;
          align-items: center;
          background-color: var(--panel-bg);
          padding: 8px 12px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .search-container input {
          flex: 1;
          background-color: #232323;
          border: none;
          outline: none;
          padding: 8px 12px;
          border-radius: 15px;
          color: var(--primary-text);
        }
        
        .search-close {
          background: none;
          border: none;
          color: var(--secondary-text);
          cursor: pointer;
          margin-left: 10px;
        }
        
        .gift-ideas-container {
          background-color: var(--panel-bg);
          border-bottom: 1px solid var(--border-color);
          padding: 12px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .gift-ideas-container h4 {
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 14px;
          color: var(--primary);
        }
        
        .gift-ideas-list {
          margin-bottom: 12px;
          max-height: 180px;
          overflow-y: auto;
        }
        
        .gift-idea-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin-bottom: 8px;
        }
        
        .gift-idea-content {
          flex: 1;
        }
        
        .gift-idea-text {
          font-size: 14px;
          color: var(--primary-text);
        }
        
        .gift-idea-occasion {
          font-size: 12px;
          color: var(--primary);
          margin-top: 4px;
        }
        
        .remove-idea-btn {
          background: none;
          border: none;
          color: #ff6b6b;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .add-gift-idea {
          display: flex;
          gap: 8px;
        }
        
        .add-gift-idea input {
          flex: 1;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--primary-text);
          font-size: 14px;
        }
        
        .add-gift-idea button {
          padding: 8px 12px;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .add-gift-idea button:hover {
          background-color: var(--primary-light);
        }
        
        .no-ideas {
          color: var(--secondary-text);
          text-align: center;
          font-size: 14px;
          padding: 20px 0;
        }
        
        .chat-actions-right {
          display: flex;
          gap: 8px;
        }
        
        .gift-btn, .key-dates-btn {
          font-size: 12px;
          padding: 4px 8px;
        }
        
        .key-dates-container {
          background-color: var(--panel-bg);
          border-bottom: 1px solid var(--border-color);
          padding: 12px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .key-dates-container h4 {
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 14px;
          color: var(--primary);
        }
        
        .key-dates-list {
          margin-bottom: 12px;
          max-height: 180px;
          overflow-y: auto;
        }
        
        .key-date-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin-bottom: 8px;
        }
        
        .key-date-content {
          flex: 1;
        }
        
        .key-date-event {
          font-size: 14px;
          color: var(--primary-text);
          font-weight: bold;
        }
        
        .key-date-details {
          display: flex;
          flex-direction: column;
          margin-top: 4px;
          font-size: 12px;
        }
        
        .date-original {
          color: var(--secondary-text);
        }
        
        .date-next {
          color: var(--primary);
          margin-top: 2px;
        }
        
        .remove-date-btn {
          background: none;
          border: none;
          color: #ff6b6b;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .add-key-date {
          display: flex;
          gap: 8px;
        }
        
        .add-key-date input {
          flex: 1;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--primary-text);
          font-size: 14px;
        }
        
        .add-key-date button {
          padding: 8px 12px;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .add-key-date button:hover {
          background-color: var(--primary-light);
        }
        
        .no-dates {
          color: var(--secondary-text);
          text-align: center;
          font-size: 14px;
          padding: 20px 0;
        }
        
        .chat-header-actions {
          display: flex;
          gap: 8px;
        }
        
        .emoji-picker {
          position: absolute;
          bottom: 70px;
          left: 10px;
          background-color: var(--panel-bg);
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          width: 300px;
          z-index: 10;
          border: 1px solid var(--border-color);
          overflow: hidden;
        }
        
        .emoji-picker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .emoji-categories {
          display: flex;
          overflow-x: auto;
          scrollbar-width: none;
          gap: 8px;
        }
        
        .emoji-categories::-webkit-scrollbar {
          display: none;
        }
        
        .category-btn {
          background: none;
          border: none;
          padding: 4px 8px;
          font-size: 12px;
          color: var(--secondary-text);
          cursor: pointer;
          border-radius: 12px;
          white-space: nowrap;
        }
        
        .category-btn.active {
          background-color: var(--primary);
          color: white;
        }
        
        .emoji-close-btn {
          background: none;
          border: none;
          color: var(--secondary-text);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .emoji-list {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 5px;
          padding: 10px;
          max-height: 200px;
          overflow-y: auto;
        }
        
        .emoji-item {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          padding: 5px;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .emoji-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(240, 71, 71, 0.7);
          }
          
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(240, 71, 71, 0);
          }
          
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(240, 71, 71, 0);
          }
        }
      `}</style>
    </div>
  );
}

export default ChatWindow; 