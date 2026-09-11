import React, { useState, useEffect } from 'react';
import { collection, addQuery, query, where, orderBy, onSnapshot, addDoc, getFirestore } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

export default function TransactionChat({ transactionId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const db = getFirestore();
  const currentUser = auth.currentUser;

  // Real-time listener for chat messages tied to this transaction
  useEffect(() => {
    if (!transactionId) return;

    // Note: Ensure your Firestore has a composite index if sorting by createdAt fails, 
    // or fetch without orderBy and sort in memory if needed.
    const q = query(
      collection(db, 'messages'),
      where('transactionId', '==', transactionId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort messages by timestamp locally to ensure chronological order
      msgList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      setMessages(msgList);
      setLoading(false);
    }, (error) => {
      console.error("Chat sync error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [transactionId, db]);

  // Send a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      await addDoc(collection(db, 'messages'), {
        transactionId: transactionId,
        senderId: currentUser.uid,
        senderEmail: currentUser.email || 'User',
        text: newMessage,
        createdAt: new Date().toISOString()
      });

      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col h-[400px] my-6">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <h3 className="font-bold text-sm text-slate-900">Secure Transaction Chat</h3>
        <p className="text-xs text-gray-500">Discuss item details, shipping status, or questions safely with your counterpart.</p>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {loading ? (
          <div className="text-center text-xs text-gray-400 py-10">Loading secure chat...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-xs text-gray-400 py-10">
            No messages yet. Send a message to start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = currentUser && msg.senderId === currentUser.uid;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-gray-400 mb-0.5 px-1">
                  {isMe ? 'You' : msg.senderEmail}
                </span>
                <div className={`max-w-[75%] px-3.5 py-2 rounded-xl text-sm ${
                  isMe ? 'bg-orange-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-xs'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white rounded-b-xl flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a secure message..."
          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button 
          type="submit"
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}