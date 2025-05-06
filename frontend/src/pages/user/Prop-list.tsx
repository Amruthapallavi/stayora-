// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { FaBed, FaBath } from "react-icons/fa";
// import { MdLocationOn, MdApartment } from "react-icons/md";
// import { useAuthStore } from "../../stores/authStore"; // Import store
// import Navbar from "../../components/user/Navbar";

// interface Property {
//   _id: string; // Use string for MongoDB _id
//   title: string;
//   location: string;
//   beds: number;
//   baths: number;
//   type: string;
//   price: string;
//   image: string;
// }

// const PropertyCard = ({ property }: { property: Property }) => {
//   const locationText =
//     typeof property.location === "string"
//       ? property.location
//       : property.location?.location || "Unknown Location"; // Extract a meaningful string

//   return (
//     <motion.div
//       className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
//       whileHover={{ scale: 1.05 }}
//     >
//       <div className="relative">
//         <img src={property.image} alt={property.title} className="w-full h-52 object-cover" />
//         <span className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
//           {property.price}
//         </span>
//       </div>
//       <div className="p-4">
//         <h3 className="text-lg font-semibold">{property.title}</h3>
//         <p className="text-gray-500 flex items-center gap-1">
//           <MdLocationOn className="text-amber-500" /> {locationText}
//         </p>
//         <div className="flex justify-between mt-3 text-gray-700">
//           <p className="flex items-center gap-1">
//             <FaBed /> {property.beds} Beds
//           </p>
//           <p className="flex items-center gap-1">
//             <FaBath /> {property.baths} Baths
//           </p>
//           <p className="flex items-center gap-1">
//             <MdApartment /> {property.type}
//           </p>
//         </div>
//         <button className="w-full bg-amber-500 text-white py-2 mt-4 rounded-lg font-semibold hover:bg-amber-600 transition">
//           View Details
//         </button>
//       </div>
//     </motion.div>
//   );
// };


// export default function PropertyListing() {
//   const getAllProperties = useAuthStore((state) => state.getAllProperties);
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     async function fetchProperties() {
//       setLoading(true);
//       try {
//         const response = await getAllProperties();
//         console.log("Fetched data:", response); // Debug API response structure
  
//         if (response && Array.isArray(response.properties)) {
//           setProperties(response.properties); // Extract 'properties' array
//         } else {
//           console.warn("Invalid property data format:", response);
//           setProperties([]); // Avoid undefined errors
//         }
//       } catch (error) {
//         console.error("Error fetching properties:", error);
//         setProperties([]); // Prevent crashes on errors
//       } finally {
//         setLoading(false);
//       }
//     }
  
//     fetchProperties();
//   }, []);
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <div className="min-w-9xl mx-auto p-6 mt-16">
//         <motion.h2
//           className="text-3xl font-bold text-center"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           Featured Properties
//         </motion.h2>
//         <p className="text-gray-500 text-center mt-2 mb-6">
//           Discover our selection of premium rental properties in top locations
//         </p>

//         {loading ? (
//           <p className="text-center text-gray-500">Loading properties...</p>
//         ) : properties.length === 0 ? (
//           <p className="text-center text-gray-500">No properties available.</p>
//         ) : (
//           <div className="grid md:grid-cols-3 gap-6">
//             {properties.map((property) => (
//               <PropertyCard key={property._id} property={property} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// // import { useEffect, useState } from "react";
// // import { motion } from "framer-motion";
// // import { useNavigate } from "react-router-dom";
// // import Sidebar from "../../components/owner/Sidebar";
// // import { useAuthStore } from "../../stores/authStore";
// // import { notifyError, notifySuccess } from "../../utils/notifications";
// // import { validatePropertyForm } from "../../utils/validators";

// // interface Feature {
// //   _id: string;
// //   name: string;
// // }

// // interface FormData {
// //   title: string;
// //   type: string;
// //   minLeasePeriod: string;
// //   maxLeasePeriod: string;
// //   bedrooms: string;
// //   bathrooms: string;
// //   address: string;
// //   city: string;
// //   state: string;
// //   pincode: string;
// //   rentPerMonth: string;
// //   furnishing:string;
// //   description:string;
// //   rules: string;
// //   cancellationPolicy: string;
// //   selectedFeatures: string[];
// //   addedOtherFeatures: string[];
// //   selectedImages: string[];
// // }

// // const AddProperty = () => {
// //   const navigate = useNavigate();
// //   const { listAllFeatures, addProperty } = useAuthStore();
  
// //   const [features, setFeatures] = useState<Feature[]>([]);
// //   const [otherFeatures, setOtherFeatures] = useState<string>("");
// //   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
// //   const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
// //   const [formData, setFormData] = useState<FormData>({
// //     title: "",
// //     type: "",
// //     minLeasePeriod: "",
// //     maxLeasePeriod: "",
// //     bedrooms: "",
// //     bathrooms: "",
// //     address: "",
// //     city: "",
// //     state: "",
// //     pincode: "",
// //     rentPerMonth: "",
// //     description:"",
// //     rules: "",
// //     furnishing:"",
// //     cancellationPolicy: "",
// //     selectedFeatures: [],
// //     addedOtherFeatures: [],
// //     selectedImages: [],
// //   });

// //   useEffect(() => {
// //     loadFeatures();
// //   }, []);
  
// //   const loadFeatures = async () => {
// //     try {
// //       const response = await listAllFeatures();
// //       setFeatures(response.features);
// //       console.log(response)
// //     } catch (error) {
// //       notifyError("Failed to load features.");
// //       console.error("Error loading features:", error);
// //     }
// //   };
  
// //   const handleFeatureSelect = (featureId: string) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       selectedFeatures: prev.selectedFeatures.includes(featureId)
// //         ? prev.selectedFeatures.filter((id) => id !== featureId)
// //         : [...prev.selectedFeatures, featureId],
// //     }));
// //   };
  
// //   const handleAddOtherFeature = () => {
// //     if (otherFeatures.trim() !== "") {
// //       setFormData((prev) => ({
// //         ...prev,
// //         addedOtherFeatures: [...prev.addedOtherFeatures, otherFeatures.trim()],
// //       }));
// //       setOtherFeatures("");
// //     }
// //   };

// //   const removeOtherFeature = (index: number) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       addedOtherFeatures: prev.addedOtherFeatures.filter((_, i) => i !== index),
// //     }));
// //   };

// //   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     if (!event.target.files) return;

// //     const files = Array.from(event.target.files);
// //     const newImageUrls = files.map((file) => URL.createObjectURL(file));

// //     setFormData((prev) => ({
// //       ...prev,
// //       selectedImages: [...prev.selectedImages, ...newImageUrls],
// //     }));
// //   };

// //   const removeImage = (index: number) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       selectedImages: prev.selectedImages.filter((_, i) => i !== index),
// //     }));
// //   };

// //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: value,
// //     }));
    
// //     // Clear error when user starts typing
// //     if (errors[name]) {
// //       setErrors((prev) => ({ ...prev, [name]: "" }));
// //     }
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
    
// //     // Validate form
// //     const validationErrors = validatePropertyForm(formData);
    
// //     if (Object.keys(validationErrors).length > 0) {
// //       setErrors(validationErrors);
// //       notifyError("Please fix the errors before submitting.");
// //       return;
// //     }
    
// //     setIsSubmitting(true);
    
// //     try {
// //       // Submit form data
// //       console.log(formData)
// //       const response = await addProperty({
// //         ...formData,
// //         minLeasePeriod: Number(formData.minLeasePeriod),
// //         maxLeasePeriod: Number(formData.maxLeasePeriod),
// //         bedrooms: Number(formData.bedrooms),
// //         bathrooms: Number(formData.bathrooms),
// //         rentPerMonth: Number(formData.rentPerMonth),
// //       });
      
// //       // notifySuccess("Property added successfully!");
// //       // Navigate to properties list after successful submission
// //       // navigate("/properties");
// //     } catch (error) {
// //       console.error("Error submitting form:", error);
// //       notifyError("Failed to add property. Please try again.");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const handleCancel = () => {
// //     navigate("/owner/properties");
// //   };
  
// //   return (
// //     <div className="flex min-h-screen bg-gray-100">
// //       <Sidebar />
// //       <div className="flex-1 overflow-auto p-8">
// //         <motion.form 
// //           onSubmit={handleSubmit}
// //           className="max-w-4xl mx-auto"
// //           initial={{ opacity: 0, y: -20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //         >
// //           <div className="bg-white shadow-lg border-2 border-golden rounded-lg p-6 w-full">
// //             <h2 className="text-center text-golden-dark text-2xl font-bold mb-6">Add New Property</h2>

// //             {/* Basic Information */}
// //             <div className="mb-6">
// //               <h3 className="text-lg font-semibold text-golden-dark mb-3 border-b border-golden-light pb-2">Basic Information</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 {/* House Name */}
// //                 <div>
// //                   <label htmlFor="title" className="block text-gray-700 font-semibold mb-1">House title</label>
// //                   <input 
// //                     type="text" 
// //                     id="title"
// //                     name="title"
// //                     value={formData.title}
// //                     onChange={handleInputChange}
// //                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.name ? 'border-red-500' : ''}`}
// //                   />
// //                   {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
// //                 </div>

// //                 {/* Type */}
// //                 <div>
// //                   <label htmlFor="type" className="block text-gray-700 font-semibold mb-1">Type</label>
// //                   <input 
// //                     type="text" 
// //                     id="type"
// //                     name="type"
// //                     value={formData.type}
// //                     onChange={handleInputChange}
// //                     placeholder="Apartment, House, Villa, etc."
// //                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.type ? 'border-red-500' : ''}`}
// //                   />
// //                   {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
// //                 </div>

// //                 {/* Min Lease Period */}
// //                 <div>
// //                   <label htmlFor="minLeasePeriod" className="block text-gray-700 font-semibold mb-1">Min Lease Period (months)</label>
// //                   <input 
// //                     type="number" 
// //                     id="minLeasePeriod"
// //                     name="minLeasePeriod"
// //                     value={formData.minLeasePeriod}
// //                     onChange={handleInputChange}
// //                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.minLeasePeriod ? 'border-red-500' : ''}`}
// //                   />
// //                   {errors.minLeasePeriod && <p className="text-red-500 text-sm mt-1">{errors.minLeasePeriod}</p>}
// //                 </div>

// //                 {/* Max Lease Period */}
// //                 <div>
// //                   <label htmlFor="maxLeasePeriod" className="block text-gray-700 font-semibold mb-1">Max Lease Period (months)</label>
// //                   <input 
// //                     type="number" 
// //                     id="maxLeasePeriod"
// //                     name="maxLeasePeriod"
// //                     value={formData.maxLeasePeriod}
// //                     onChange={handleInputChange}
// //                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.maxLeasePeriod ? 'border-red-500' : ''}`}
// //                   />
// //                   {errors.maxLeasePeriod && <p className="text-red-500 text-sm mt-1">{errors.maxLeasePeriod}</p>}
// //                 </div>

// //                 {/* Bedrooms */}
// //                 <div>
// //                   <label htmlFor="bedrooms" className="block text-gray-700 font-semibold mb-1">Bedrooms</label>
// //                   <input 
// //                     type="number" 
// //                     id="bedrooms"
// //                     name="bedrooms"
// //                     value={formData.bedrooms}
// //                     onChange={handleInputChange}
// //                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.bedrooms ? 'border-red-500' : ''}`}
// //                   />
// //                   {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
// //                 </div>

// //                 {/* Bathrooms */}
// //                 <div>
// //                   <label htmlFor="bathrooms" className="block text-gray-700 font-semibold mb-1">Bathrooms</label>
// //                   <input 
// //                     type="number" 
// //                     id="bathrooms"
// //                     name="bathrooms"
// //                     value={formData.bathrooms}
// //                     onChange={handleInputChange}
// //                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.bathrooms ? 'border-red-500' : ''}`}
// //                   />
// //                   {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
// //                 </div>


// //                 <div>
// //   <label htmlFor="furnishing" className="block text-gray-700 font-semibold mb-1">
// //     Furnishing
// //   </label>
// //   <select
// //     id="furnishing"
// //     name="furnishing"
// //     value={formData.furnishing}
// //     onChange={handleInputChange}
// //     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.furnishing ? 'border-red-500' : ''}`}
// //   >
// //     <option value="">Select Furnishing</option>
// //     <option value="Fully-Furnished">Fully-Furnished</option>
// //     <option value="Semi-Furnished">Semi-Furnished</option>
// //     <option value="Not-Furnished">Not-Furnished</option>
// //   </select>
// //   {errors.furnishing && <p className="text-red-500 text-sm mt-1">{errors.furnishing}</p>}
// // </div>

// //                 {/* Rent per Month */}
                
                
// //                 <div>
// //                   <label htmlFor="rentPerMonth" className="block text-gray-700 font-semibold mb-1">Rent per Month</label>
// //                   <input 
// //                     type="number" 
// //                     id="rentPerMonth"
// //                     name="rentPerMonth"
// //                     value={formData.rentPerMonth}
// //                     onChange={handleInputChange}
// //                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.rentPerMonth ? 'border-red-500' : ''}`}
// //                   />
// //                   {errors.rentPerMonth && <p className="text-red-500 text-sm mt-1">{errors.rentPerMonth}</p>}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Location Information */}
// //             <div className="mb-6">
// //               <h3 className="text-lg font-semibold text-golden-dark mb-3 border-b border-golden-light pb-2">Location Information</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 {/* Address */}
// //                 <div className="md:col-span-2">
// //                   <label htmlFor="address" className="block text-gray-700 font-semibold mb-1">Address</label>
// //                   <input 
// //                     type="text" 
// //                     id="address"
// //                     name="address"
// //                     value={formData.address}
// //                     onChange={handleInputChange}
// //                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.address ? 'border-red-500' : ''}`}
// //                   />
// //                   {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
// //                 </div>

// //                 {/* City */}
// //                 <div>
// //                   <label htmlFor="city" className="block text-gray-700 font-semibold mb-1">City</label>
// //                   <input 
// //                     type="text" 
// //                     id="city"
// //                     name="city"
// //                     value={formData.city}
// //                     onChange={handleInputChange}
// //                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.city ? 'border-red-500' : ''}`}
// //                   />
// //                   {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
// //                 </div>

// //                 {/* State */}
// //                 <div>
// //                   <label htmlFor="state" className="block text-gray-700 font-semibold mb-1">State</label>
// //                   <input 
// //                     type="text" 
// //                     id="state"
// //                     name="state"
// //                     value={formData.state}
// //                     onChange={handleInputChange}
// //                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.state ? 'border-red-500' : ''}`}
// //                   />
// //                   {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
// //                 </div>

// //                 {/* Pincode */}
// //                 <div>
// //                   <label htmlFor="pincode" className="block text-gray-700 font-semibold mb-1">Pincode</label>
// //                   <input 
// //                     type="text" 
// //                     id="pincode"
// //                     name="pincode"
// //                     value={formData.pincode}
// //                     onChange={handleInputChange}
// //                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.pincode ? 'border-red-500' : ''}`}
// //                   />
// //                   {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Property Details */}
// //             <div className="mb-6">
// //               <h3 className="text-lg font-semibold text-golden-dark mb-3 border-b border-golden-light pb-2">Property Details</h3>
// //               <div className="grid grid-cols-1 gap-4">

// //               <div>
// //                   <label htmlFor="description" className="block text-gray-700 font-semibold mb-1"> Property Description</label>
// //                   <textarea 
// //                     id="description"
// //                     name="description"
// //                     value={formData.description}
// //                     onChange={handleInputChange}
// //                     className={`border w-full p-2 rounded-md h-20 resize-none focus:ring-2 focus:ring-golden ${errors.rules ? 'border-red-500' : ''}`}
// //                   ></textarea>
// //                   {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
// //                 </div>
// //                 {/* Rules */}
// //                 <div>
// //                   <label htmlFor="rules" className="block text-gray-700 font-semibold mb-1">Rules</label>
// //                   <textarea 
// //                     id="rules"
// //                     name="rules"
// //                     value={formData.rules}
// //                     onChange={handleInputChange}
// //                     className={`border w-full p-2 rounded-md h-20 resize-none focus:ring-2 focus:ring-golden ${errors.rules ? 'border-red-500' : ''}`}
// //                   ></textarea>
// //                   {errors.rules && <p className="text-red-500 text-sm mt-1">{errors.rules}</p>}
// //                 </div>

// //                 {/* Cancellation Policy */}
// //                 <div>
// //                   <label htmlFor="cancellationPolicy" className="block text-gray-700 font-semibold mb-1">Cancellation Policy</label>
// //                   <textarea 
// //                     id="cancellationPolicy"
// //                     name="cancellationPolicy"
// //                     value={formData.cancellationPolicy}
// //                     onChange={handleInputChange}
// //                     className={`border w-full p-2 rounded-md h-20 resize-none focus:ring-2 focus:ring-golden ${errors.cancellationPolicy ? 'border-red-500' : ''}`}
// //                   ></textarea>
// //                   {errors.cancellationPolicy && <p className="text-red-500 text-sm mt-1">{errors.cancellationPolicy}</p>}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Features */}
// //             <div className="mb-6">
// //               <h3 className="text-lg font-semibold text-golden-dark mb-3 border-b border-golden-light pb-2">Features</h3>
              
// //               {/* Available Features */}
// //               <div className="mb-4">
// //                 <label className="block text-gray-700 font-semibold mb-2">Available Features</label>
// //                 <div className="border w-full p-3 rounded-md grid grid-cols-2 sm:grid-cols-3 gap-2">
// //                   {features.length > 0 ? (
// //                     features.map((feature) => (
// //                       <label key={feature._id} className="inline-flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
// //                         <input
// //                           type="checkbox"
// //                           className="mr-2 h-4 w-4 text-golden"
// //                           checked={formData.selectedFeatures.includes(feature._id)}
// //                           onChange={() => handleFeatureSelect(feature._id)}
// //                         />
// //                         <span>{feature.name}</span>
// //                       </label>
// //                     ))
// //                   ) : (
// //                     <p className="text-gray-500 col-span-full">No features available</p>
// //                   )}
// //                 </div>
// //               </div>
              
// //               {/* Other Features */}
// //               <div>
// //                 <label className="block text-gray-700 font-semibold mb-2">Other Features</label>
// //                 <div className="flex items-center gap-2">
// //                   <input
// //                     type="text"
// //                     value={otherFeatures}
// //                     onChange={(e) => setOtherFeatures(e.target.value)}
// //                     className="border w-full p-2 rounded-md focus:ring-2 focus:ring-golden"
// //                     placeholder="Add custom feature"
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={handleAddOtherFeature}
// //                     className="bg-golden text-white px-4 py-2 rounded-md shadow-md hover:bg-golden-dark transition"
// //                   >
// //                     Add
// //                   </button>
// //                 </div>
                
// //                 {formData.addedOtherFeatures.length > 0 && (
// //                   <div className="flex flex-wrap gap-2 mt-3">
// //                     {formData.addedOtherFeatures.map((feature, index) => (
// //                       <div key={index} className="bg-gray-100 pl-3 pr-2 py-1 rounded-md flex items-center text-sm">
// //                         {feature}
// //                         <button
// //                           type="button"
// //                           onClick={() => removeOtherFeature(index)}
// //                           className="ml-2 text-red-500 hover:text-red-700"
// //                         >
// //                           ×
// //                         </button>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Images */}
// //             <div className="mb-6">
// //               <h3 className="text-lg font-semibold text-golden-dark mb-3 border-b border-golden-light pb-2">Property Images</h3>
              
// //               <div className="text-center">
// //                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3 bg-gray-50">
// //                   <div className="flex flex-wrap gap-3 justify-center">
// //                     {formData.selectedImages.length > 0 ? (
// //                       formData.selectedImages.map((image, index) => (
// //                         <div key={index} className="relative w-24 h-24">
// //                           <img 
// //                             src={image} 
// //                             alt={`Upload ${index}`} 
// //                             className="w-full h-full object-cover rounded-lg border border-gray-300"
// //                           />
// //                           <button 
// //                             type="button"
// //                             onClick={() => removeImage(index)} 
// //                             className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md"
// //                           >
// //                             ×
// //                           </button>
// //                         </div>
// //                       ))
// //                     ) : (
// //                       <div className="text-gray-500 py-8 text-center w-full">
// //                         <p className="mb-2">No images selected</p>
// //                         <p className="text-sm">Click below to upload images</p>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
                
// //                 <label className="inline-block cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition">
// //                   <input 
// //                     type="file" 
// //                     multiple 
// //                     accept="image/*"
// //                     className="hidden"
// //                     onChange={handleImageChange}
// //                   />
// //                   Select Images
// //                 </label>
// //               </div>
// //             </div>

// //             {/* Action Buttons */}
// //             <div className="flex justify-center gap-4 mt-8">
// //             <motion.button 
// //               onClick={handleSubmit} 

// //               whileHover={{ scale: 1.05 }} 
// //               whileTap={{ scale: 0.95 }} 
// //               className="bg-[#b38e5d] text-white px-6 py-2 rounded-md shadow-md hover:bg-[#8b6b3b]"
// //             >
// //               Add House
// //             </motion.button>
// //             <motion.button 
// //             onClick={handleCancel}
// //               whileHover={{ scale: 1.05 }} 
// //               whileTap={{ scale: 0.95 }} 
// //               className="border border-[#b38e5d] text-[#b38e5d] px-6 py-2 rounded-md shadow-md hover:bg-[#f5e1c6]"
// //             >
// //               Cancel
// //             </motion.button>
// //             </div>
// //           </div>
// //         </motion.form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AddProperty;