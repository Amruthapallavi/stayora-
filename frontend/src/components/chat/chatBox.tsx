// import { useEffect, useRef, useState } from 'react';
// import io from 'socket.io-client';
// import { notifyError } from '../../utils/notifications';
// import { useAuthStore } from '../../stores/authStore';

// type Message = {
//   _id: string;
//   content: string;
//   sender: string | { _id: string };
//   senderModel: string;
//   receiver: string;
//   propertyId?: string;
//   receiverModel: string;
//   images?: string[];
//   createdAt: string;
// };

// interface Props {
//   user: any;
//   receiverId: string;
//   propertyId: string;
//   className?: string;
// }

// interface ChatPartner {
//   _id: string;
//   name: string;
//   email: string;
//   profileImage?: string;
// }

// const ChatBox: React.FC<Props> = ({ user, receiverId, propertyId, className }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [messageText, setMessageText] = useState('');
 
  
//   const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
//   const [sending, setSending] = useState(false);
//   const [
//     _chatPartner,
//      setChatPartner] = useState<ChatPartner | null>(null);
//   const [loading, setLoading] = useState(true);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const { sendMessage, getConversation } = useAuthStore();

//   useEffect(() => {
//     const socketInstance = io('http://localhost:3000'); 
//     setSocket(socketInstance);

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (!socket || !user || !receiverId) return;

//     const senderId = user.userId || user.id;
//     const room = [senderId, receiverId].sort().join('-');

//     socket.emit('joinRoom', room);

//     socket.on('receiveMessage', (newMessage: Message) => {
//       setMessages(prev => [...prev, newMessage]);
//     });

//     return () => {
//       socket.off('receiveMessage');
//     };
//   }, [socket, user, receiverId]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   useEffect(() => {
//     console.log("cehkibg")
//     if (!user || !receiverId) return;

//     const fetchConversation = async () => {
//       try {
//         setLoading(true);
//         const senderId = user.userId || user.id;
//         const result = await getConversation(senderId, receiverId);
//         console.log(result,"for chattinf");
//         if (result && result.data) {
//           setMessages(result.data || []);
//           if (result.data.partner) {
//             setChatPartner(result.data.partner);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching conversation:", error);
//         notifyError("Failed to load conversation");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchConversation();
//   }, [user, receiverId, getConversation]);

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!messageText.trim()) return;

//     try {
//       setSending(true);
//       const senderId = user.userId || user.id;
//       const room = [senderId, receiverId].sort().join('-');

//       const messagePayload = {
//         sender: senderId,
//         senderModel: 'user',
//         receiver: receiverId,
//         receiverModel: 'owner',
//         content: messageText,
//         room,
//         propertyId,
//       };

//       const response = await sendMessage(messagePayload);
//       socket?.emit('sendMessage', response.data); // broadcast to room
//       setMessages(prev => [...prev, response.data]); // show in own chat
//       setMessageText('');
//     } catch (err) {
//       console.error('Send error:', err);
//       notifyError('Failed to send message');
//     } finally {
//       setSending(false);
//     }
//   };
// if(loading){
//   return(
//     <div>
//     </div>
//   )
// }
//   return (
//     <div className={`flex flex-col border rounded p-4 bg-white ${className}`}>
//       <div className="flex-1 overflow-y-auto mb-4 space-y-2">
//         {messages.map((msg, i) => {
//           const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender?._id;
//           const isOwnMessage = senderId === (user.userId || user.id);

//           return (
//             <div
//               key={`${msg._id}-${i}`}
//               className={`p-2 rounded-md ${
//                 isOwnMessage ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'
//               }`}
//             >
//               <p>{msg.content}</p>
//               <small className="text-gray-500 text-sm">
//                 {new Date(msg.createdAt).toLocaleTimeString()}
//               </small>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       <form onSubmit={handleSendMessage} className="flex gap-2">
//         <input
//           type="text"
//           placeholder="Type a message..."
//           className="flex-1 border px-3 py-2 rounded"
//           value={messageText}
//           onChange={(e) => setMessageText(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
//           disabled={sending}
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatBox;
