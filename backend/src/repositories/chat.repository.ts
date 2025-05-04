// import { IChat } from '../models/notification.model';
// import  Message, { IMessage }  from '../models/message.model';
// import BaseRepository from './base.repository';
// import  IChatRepository  from './interfaces/IChatRepository';

// class ChatRepository extends BaseRepository<IMessage> implements IChatRepository {
//   constructor() {
//     super(Message);
//   }

// //   async saveMessage(
// //     senderId: string,
// //     senderType: string,
// //     receiverId: string,
// //     receiverType: string,
// //     propertyId: string,
// //     content: string
// //   ) {
// //     const newMessage = new Message({
// //       senderId,
// //       senderType,
// //       receiverId,
// //       receiverType,
// //       propertyId,
// //       message: content,
// //       timestamp: new Date(),
// //     });

// //     const savedMessage = await newMessage.save();

// //     return {
// //       _id: savedMessage._id,
// //       senderId: savedMessage.sender,
// //     //   senderType: savedMessage.senderType,
// //       receiverId: savedMessage.receiver,
// //     //   receiverType: savedMessage.receiverType,
// //     //   propertyId: savedMessage.propertyId,
// //     //   message: savedMessage.message,
// //     //   timestamp: savedMessage.timestamp,
// //     };
// //   }
// }

// export default new ChatRepository();
