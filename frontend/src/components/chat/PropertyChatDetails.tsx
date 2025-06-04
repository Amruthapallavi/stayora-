// import { Card } from '../../components/ui/card';
// import { MessageSquare } from 'lucide-react';
// import { Property } from '../../types/property';


// interface PropertyChatDetailsProps {
//   property: Property;
// }

// const PropertyChatDetails = ({ property }: PropertyChatDetailsProps) => {
//   console.log(property,"data")
//   return (
//     <Card className="p-6">
//       <div className="space-y-6">
//         {/* Property Image */}
//         <div className="aspect-video rounded-lg bg-gray-200 overflow-hidden">
//           {property.images[0] && (
//             <img
//               src={property.images[0]}
//             //   alt={property.name}
//               className="w-full h-full object-cover"
//             />
//           )}
//         </div>

//         {/* Property Details */}
//         <div>
//           <h2 className="text-2xl font-semibold mb-2">{property.title}</h2>
//           <p className="text-gray-600 mb-4">{property.description}</p>
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <MessageSquare className="h-4 w-4 text-gray-500" />
//               <span className="text-sm text-gray-600">Chatting with: {property.ownerId?.name}</span>
//             </div>
//             <p className="text-sm text-gray-600">Location: {property.location.address}</p>
//             <p className="text-sm text-gray-600">Price: ${property.rentPerMonth}/month</p>
//           </div>
//         </div>

//         {/* Features */}
//         <div>
//           <h3 className="font-semibold mb-2">Features</h3>
//           <div className="flex flex-wrap gap-2">
//             {/* {property.features.map((feature, index) => (
//               <span
//                 key={index}
//                 className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600"
//               >
//                 {feature}
//               </span>
//             ))} */}
//           </div>
//         </div>

//         {/* Contact Info */}
//         <div>
//           <h3 className="font-semibold mb-2">Contact Information</h3>
//           <div className="space-y-1">
//             <p className="text-sm text-gray-600">Email: {property.owner?.email}</p>
//             <p className="text-sm text-gray-600">Phone: {property.owner?.phone}</p>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default PropertyChatDetails;
