// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../../components/owner/Sidebar";
// import { useAuthStore } from "../../stores/authStore";
// import { notifyError, notifySuccess } from "../../utils/notifications";
// import { validatePropertyForm } from "../../utils/validators";

// interface Feature {
//   _id: string;
//   name: string;
// }

// interface FormData {
//   title: string;
//   type: string;
//   minLeasePeriod: string;
//   maxLeasePeriod: string;
//   bedrooms: string;
//   bathrooms: string;
//   address: string;
//   city: string;
//   state: string;
//   pincode: string;
//   rentPerMonth: string;
//   furnishing:string;
//   description:string;
//   rules: string;
//   cancellationPolicy: string;
//   selectedFeatures: string[];
//   addedOtherFeatures: string[];
//   selectedImages: string[];
// }

// const AddProperty = () => {
//   const navigate = useNavigate();
//   const { listAllFeatures, addProperty } = useAuthStore();
  
//   const [features, setFeatures] = useState<Feature[]>([]);
//   const [otherFeatures, setOtherFeatures] = useState<string>("");
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
//   const [formData, setFormData] = useState<FormData>({
//     title: "",
//     type: "",
//     minLeasePeriod: "",
//     maxLeasePeriod: "",
//     bedrooms: "",
//     bathrooms: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//     rentPerMonth: "",
//     description:"",
//     rules: "",
//     furnishing:"",
//     cancellationPolicy: "",
//     selectedFeatures: [],
//     addedOtherFeatures: [],
//     selectedImages: [],
//   });

//   useEffect(() => {
//     loadFeatures();
//   }, []);
  
//   const loadFeatures = async () => {
//     try {
//       const response = await listAllFeatures();
//       setFeatures(response.features);
//       console.log(response)
//     } catch (error) {
//       notifyError("Failed to load features.");
//       console.error("Error loading features:", error);
//     }
//   };
  
//   const handleFeatureSelect = (featureId: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedFeatures: prev.selectedFeatures.includes(featureId)
//         ? prev.selectedFeatures.filter((id) => id !== featureId)
//         : [...prev.selectedFeatures, featureId],
//     }));
//   };
  
//   const handleAddOtherFeature = () => {
//     if (otherFeatures.trim() !== "") {
//       setFormData((prev) => ({
//         ...prev,
//         addedOtherFeatures: [...prev.addedOtherFeatures, otherFeatures.trim()],
//       }));
//       setOtherFeatures("");
//     }
//   };

//   const removeOtherFeature = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       addedOtherFeatures: prev.addedOtherFeatures.filter((_, i) => i !== index),
//     }));
//   };

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (!event.target.files) return;

//     const files = Array.from(event.target.files);
//     const newImageUrls = files.map((file) => URL.createObjectURL(file));

//     setFormData((prev) => ({
//       ...prev,
//       selectedImages: [...prev.selectedImages, ...newImageUrls],
//     }));
//   };

//   const removeImage = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedImages: prev.selectedImages.filter((_, i) => i !== index),
//     }));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Validate form
//     const validationErrors = validatePropertyForm(formData);
    
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       notifyError("Please fix the errors before submitting.");
//       return;
//     }
    
//     setIsSubmitting(true);
    
//     try {
//       // Submit form data
//       console.log(formData)
//       const response = await addProperty({
//         ...formData,
//         minLeasePeriod: Number(formData.minLeasePeriod),
//         maxLeasePeriod: Number(formData.maxLeasePeriod),
//         bedrooms: Number(formData.bedrooms),
//         bathrooms: Number(formData.bathrooms),
//         rentPerMonth: Number(formData.rentPerMonth),
//       });
      
//       // notifySuccess("Property added successfully!");
//       // Navigate to properties list after successful submission
//       // navigate("/properties");
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       notifyError("Failed to add property. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate("/owner/properties");
//   };
  
//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar />
//       <div className="flex-1 overflow-auto p-8">
//         <motion.form 
//           onSubmit={handleSubmit}
//           className="max-w-4xl mx-auto"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <div className="bg-white shadow-lg border-2 border-golden rounded-lg p-6 w-full">
//             <h2 className="text-center text-golden-dark text-2xl font-bold mb-6">Add New Property</h2>

//             {/* Basic Information */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-golden-dark mb-3 border-b border-golden-light pb-2">Basic Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* House Name */}
//                 <div>
//                   <label htmlFor="title" className="block text-gray-700 font-semibold mb-1">House title</label>
//                   <input 
//                     type="text" 
//                     id="title"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.name ? 'border-red-500' : ''}`}
//                   />
//                   {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
//                 </div>

//                 {/* Type */}
//                 <div>
//                   <label htmlFor="type" className="block text-gray-700 font-semibold mb-1">Type</label>
//                   <input 
//                     type="text" 
//                     id="type"
//                     name="type"
//                     value={formData.type}
//                     onChange={handleInputChange}
//                     placeholder="Apartment, House, Villa, etc."
//                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.type ? 'border-red-500' : ''}`}
//                   />
//                   {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
//                 </div>

//                 {/* Min Lease Period */}
//                 <div>
//                   <label htmlFor="minLeasePeriod" className="block text-gray-700 font-semibold mb-1">Min Lease Period (months)</label>
//                   <input 
//                     type="number" 
//                     id="minLeasePeriod"
//                     name="minLeasePeriod"
//                     value={formData.minLeasePeriod}
//                     onChange={handleInputChange}
//                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.minLeasePeriod ? 'border-red-500' : ''}`}
//                   />
//                   {errors.minLeasePeriod && <p className="text-red-500 text-sm mt-1">{errors.minLeasePeriod}</p>}
//                 </div>

//                 {/* Max Lease Period */}
//                 <div>
//                   <label htmlFor="maxLeasePeriod" className="block text-gray-700 font-semibold mb-1">Max Lease Period (months)</label>
//                   <input 
//                     type="number" 
//                     id="maxLeasePeriod"
//                     name="maxLeasePeriod"
//                     value={formData.maxLeasePeriod}
//                     onChange={handleInputChange}
//                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.maxLeasePeriod ? 'border-red-500' : ''}`}
//                   />
//                   {errors.maxLeasePeriod && <p className="text-red-500 text-sm mt-1">{errors.maxLeasePeriod}</p>}
//                 </div>

//                 {/* Bedrooms */}
//                 <div>
//                   <label htmlFor="bedrooms" className="block text-gray-700 font-semibold mb-1">Bedrooms</label>
//                   <input 
//                     type="number" 
//                     id="bedrooms"
//                     name="bedrooms"
//                     value={formData.bedrooms}
//                     onChange={handleInputChange}
//                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.bedrooms ? 'border-red-500' : ''}`}
//                   />
//                   {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
//                 </div>

//                 {/* Bathrooms */}
//                 <div>
//                   <label htmlFor="bathrooms" className="block text-gray-700 font-semibold mb-1">Bathrooms</label>
//                   <input 
//                     type="number" 
//                     id="bathrooms"
//                     name="bathrooms"
//                     value={formData.bathrooms}
//                     onChange={handleInputChange}
//                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.bathrooms ? 'border-red-500' : ''}`}
//                   />
//                   {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
//                 </div>


//                 <div>
//   <label htmlFor="furnishing" className="block text-gray-700 font-semibold mb-1">
//     Furnishing
//   </label>
//   <select
//     id="furnishing"
//     name="furnishing"
//     value={formData.furnishing}
//     onChange={handleInputChange}
//     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.furnishing ? 'border-red-500' : ''}`}
//   >
//     <option value="">Select Furnishing</option>
//     <option value="Fully-Furnished">Fully-Furnished</option>
//     <option value="Semi-Furnished">Semi-Furnished</option>
//     <option value="Not-Furnished">Not-Furnished</option>
//   </select>
//   {errors.furnishing && <p className="text-red-500 text-sm mt-1">{errors.furnishing}</p>}
// </div>

//                 {/* Rent per Month */}
                
                
//                 <div>
//                   <label htmlFor="rentPerMonth" className="block text-gray-700 font-semibold mb-1">Rent per Month</label>
//                   <input 
//                     type="number" 
//                     id="rentPerMonth"
//                     name="rentPerMonth"
//                     value={formData.rentPerMonth}
//                     onChange={handleInputChange}
//                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.rentPerMonth ? 'border-red-500' : ''}`}
//                   />
//                   {errors.rentPerMonth && <p className="text-red-500 text-sm mt-1">{errors.rentPerMonth}</p>}
//                 </div>
//               </div>
//             </div>

//             {/* Location Information */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-golden-dark mb-3 border-b border-golden-light pb-2">Location Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Address */}
//                 <div className="md:col-span-2">
//                   <label htmlFor="address" className="block text-gray-700 font-semibold mb-1">Address</label>
//                   <input 
//                     type="text" 
//                     id="address"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.address ? 'border-red-500' : ''}`}
//                   />
//                   {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
//                 </div>

//                 {/* City */}
//                 <div>
//                   <label htmlFor="city" className="block text-gray-700 font-semibold mb-1">City</label>
//                   <input 
//                     type="text" 
//                     id="city"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.city ? 'border-red-500' : ''}`}
//                   />
//                   {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
//                 </div>

//                 {/* State */}
//                 <div>
//                   <label htmlFor="state" className="block text-gray-700 font-semibold mb-1">State</label>
//                   <input 
//                     type="text" 
//                     id="state"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleInputChange}
//                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.state ? 'border-red-500' : ''}`}
//                   />
//                   {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
//                 </div>

//                 {/* Pincode */}
//                 <div>
//                   <label htmlFor="pincode" className="block text-gray-700 font-semibold mb-1">Pincode</label>
//                   <input 
//                     type="text" 
//                     id="pincode"
//                     name="pincode"
//                     value={formData.pincode}
//                     onChange={handleInputChange}
//                     className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.pincode ? 'border-red-500' : ''}`}
//                   />
//                   {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
//                 </div>
//               </div>
//             </div>

//             {/* Property Details */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-golden-dark mb-3 border-b border-golden-light pb-2">Property Details</h3>
//               <div className="grid grid-cols-1 gap-4">

//               <div>
//                   <label htmlFor="description" className="block text-gray-700 font-semibold mb-1"> Property Description</label>
//                   <textarea 
//                     id="description"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className={`border w-full p-2 rounded-md h-20 resize-none focus:ring-2 focus:ring-golden ${errors.rules ? 'border-red-500' : ''}`}
//                   ></textarea>
//                   {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
//                 </div>
//                 {/* Rules */}
//                 <div>
//                   <label htmlFor="rules" className="block text-gray-700 font-semibold mb-1">Rules</label>
//                   <textarea 
//                     id="rules"
//                     name="rules"
//                     value={formData.rules}
//                     onChange={handleInputChange}
//                     className={`border w-full p-2 rounded-md h-20 resize-none focus:ring-2 focus:ring-golden ${errors.rules ? 'border-red-500' : ''}`}
//                   ></textarea>
//                   {errors.rules && <p className="text-red-500 text-sm mt-1">{errors.rules}</p>}
//                 </div>

//                 {/* Cancellation Policy */}
//                 <div>
//                   <label htmlFor="cancellationPolicy" className="block text-gray-700 font-semibold mb-1">Cancellation Policy</label>
//                   <textarea 
//                     id="cancellationPolicy"
//                     name="cancellationPolicy"
//                     value={formData.cancellationPolicy}
//                     onChange={handleInputChange}
//                     className={`border w-full p-2 rounded-md h-20 resize-none focus:ring-2 focus:ring-golden ${errors.cancellationPolicy ? 'border-red-500' : ''}`}
//                   ></textarea>
//                   {errors.cancellationPolicy && <p className="text-red-500 text-sm mt-1">{errors.cancellationPolicy}</p>}
//                 </div>
//               </div>
//             </div>

//             {/* Features */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-golden-dark mb-3 border-b border-golden-light pb-2">Features</h3>
              
//               {/* Available Features */}
//               <div className="mb-4">
//                 <label className="block text-gray-700 font-semibold mb-2">Available Features</label>
//                 <div className="border w-full p-3 rounded-md grid grid-cols-2 sm:grid-cols-3 gap-2">
//                   {features.length > 0 ? (
//                     features.map((feature) => (
//                       <label key={feature._id} className="inline-flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
//                         <input
//                           type="checkbox"
//                           className="mr-2 h-4 w-4 text-golden"
//                           checked={formData.selectedFeatures.includes(feature._id)}
//                           onChange={() => handleFeatureSelect(feature._id)}
//                         />
//                         <span>{feature.name}</span>
//                       </label>
//                     ))
//                   ) : (
//                     <p className="text-gray-500 col-span-full">No features available</p>
//                   )}
//                 </div>
//               </div>
              
//               {/* Other Features */}
//               <div>
//                 <label className="block text-gray-700 font-semibold mb-2">Other Features</label>
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="text"
//                     value={otherFeatures}
//                     onChange={(e) => setOtherFeatures(e.target.value)}
//                     className="border w-full p-2 rounded-md focus:ring-2 focus:ring-golden"
//                     placeholder="Add custom feature"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddOtherFeature}
//                     className="bg-golden text-white px-4 py-2 rounded-md shadow-md hover:bg-golden-dark transition"
//                   >
//                     Add
//                   </button>
//                 </div>
                
//                 {formData.addedOtherFeatures.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mt-3">
//                     {formData.addedOtherFeatures.map((feature, index) => (
//                       <div key={index} className="bg-gray-100 pl-3 pr-2 py-1 rounded-md flex items-center text-sm">
//                         {feature}
//                         <button
//                           type="button"
//                           onClick={() => removeOtherFeature(index)}
//                           className="ml-2 text-red-500 hover:text-red-700"
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Images */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-golden-dark mb-3 border-b border-golden-light pb-2">Property Images</h3>
              
//               <div className="text-center">
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3 bg-gray-50">
//                   <div className="flex flex-wrap gap-3 justify-center">
//                     {formData.selectedImages.length > 0 ? (
//                       formData.selectedImages.map((image, index) => (
//                         <div key={index} className="relative w-24 h-24">
//                           <img 
//                             src={image} 
//                             alt={`Upload ${index}`} 
//                             className="w-full h-full object-cover rounded-lg border border-gray-300"
//                           />
//                           <button 
//                             type="button"
//                             onClick={() => removeImage(index)} 
//                             className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md"
//                           >
//                             ×
//                           </button>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="text-gray-500 py-8 text-center w-full">
//                         <p className="mb-2">No images selected</p>
//                         <p className="text-sm">Click below to upload images</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 <label className="inline-block cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition">
//                   <input 
//                     type="file" 
//                     multiple 
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleImageChange}
//                   />
//                   Select Images
//                 </label>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-center gap-4 mt-8">
//             <motion.button 
//               onClick={handleSubmit} 

//               whileHover={{ scale: 1.05 }} 
//               whileTap={{ scale: 0.95 }} 
//               className="bg-[#b38e5d] text-white px-6 py-2 rounded-md shadow-md hover:bg-[#8b6b3b]"
//             >
//               Add House
//             </motion.button>
//             <motion.button 
//             onClick={handleCancel}
//               whileHover={{ scale: 1.05 }} 
//               whileTap={{ scale: 0.95 }} 
//               className="border border-[#b38e5d] text-[#b38e5d] px-6 py-2 rounded-md shadow-md hover:bg-[#f5e1c6]"
//             >
//               Cancel
//             </motion.button>
//             </div>
//           </div>
//         </motion.form>
//       </div>
//     </div>
//   );
// };

// export default AddProperty;






import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/owner/Sidebar";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { validatePropertyForm } from "../../utils/validators";
import Map from "../../components/owner/map";

interface Feature {
  _id: string;
  name: string;
}

interface FormData {
  title: string;
  type: string;
  minLeasePeriod: string;
  maxLeasePeriod: string;
  bedrooms: string;
  bathrooms: string;
  houseNumber: string;
  street: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  rentPerMonth: string;
  furnishing: string;
  description: string;
  rules: string;
  cancellationPolicy: string;
  selectedFeatures: string[];
  addedOtherFeatures: string[];
  selectedImages: string[];
  mapLocation?: { lat: number; lng: number };
}

const AddProperty = () => {
  const navigate = useNavigate();
  const { listAllFeatures, addProperty } = useAuthStore();
  
  const [features, setFeatures] = useState<Feature[]>([]);
  const [otherFeatures, setOtherFeatures] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [locationStep, setLocationStep] = useState<"select" | "map">("select");
  
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal"
  ];
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    type: "",
    minLeasePeriod: "",
    maxLeasePeriod: "",
    bedrooms: "",
    bathrooms: "",
    houseNumber: "",
    street: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    rentPerMonth: "",
    description: "",
    rules: "",
    furnishing: "",
    cancellationPolicy: "",
    selectedFeatures: [],
    addedOtherFeatures: [],
    selectedImages: [],
  });

  useEffect(() => {
    loadFeatures();
  }, []);
  
  const loadFeatures = async () => {
    try {
      const response = await listAllFeatures();
      setFeatures(response.features);
    } catch (error) {
      notifyError("Failed to load features.");
      console.error("Error loading features:", error);
    }
  };
  
  const handleFeatureSelect = (featureId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(featureId)
        ? prev.selectedFeatures.filter((id) => id !== featureId)
        : [...prev.selectedFeatures, featureId],
    }));
  };
  
  const handleAddOtherFeature = () => {
    if (otherFeatures.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        addedOtherFeatures: [...prev.addedOtherFeatures, otherFeatures.trim()],
      }));
      setOtherFeatures("");
    }
  };

  const removeOtherFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      addedOtherFeatures: prev.addedOtherFeatures.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    const newImageUrls = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      selectedImages: [...prev.selectedImages, ...newImageUrls],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedImages: prev.selectedImages.filter((_, i) => i !== index),
    }));
  };

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setFormData((prev) => ({
      ...prev,
      mapLocation: location
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update complete address when individual address components change
    if (name === 'houseNumber' || name === 'street' || name === 'city' || name === 'district' || name === 'state' || name === 'pincode') {
      const updatedFormData = {
        ...formData,
        [name]: value
      };
      
      // Rebuild the complete address
      const addressParts = [
        updatedFormData.houseNumber,
        updatedFormData.street,
        updatedFormData.city,
        updatedFormData.district,
        updatedFormData.state,
        updatedFormData.pincode
      ].filter(Boolean);
      
      const fullAddress = addressParts.join(', ');
      
      setFormData({
        ...updatedFormData,
        address: fullAddress
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validatePropertyForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      notifyError("Please fix the errors before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit form data
      const response = await addProperty({
        ...formData,
        minLeasePeriod: Number(formData.minLeasePeriod),
        maxLeasePeriod: Number(formData.maxLeasePeriod),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        rentPerMonth: Number(formData.rentPerMonth),
      });
      
      notifySuccess("Property added successfully!");
      // Navigate to properties list after successful submission
      navigate("/owner/properties");
    } catch (error) {
      console.error("Error submitting form:", error);
      notifyError("Failed to add property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/owner/properties");
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <motion.form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white shadow-lg border border-golden/20 rounded-lg p-6 w-full">
            <h2 className="text-center text-golden-dark text-2xl font-bold mb-6">Add New Property</h2>

            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-golden-dark mb-3 border-b border-golden-light pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* House Name */}
                <div>
                  <label htmlFor="title" className="block text-gray-700 font-semibold mb-1">House title</label>
                  <input 
                    type="text" 
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.title ? 'border-red-500' : ''}`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Type */}
                <div>
                  <label htmlFor="type" className="block text-gray-700 font-semibold mb-1">Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.type ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select Property Type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Condo">Condo</option>
                    <option value="Studio">Studio</option>
                    <option value="Townhouse">Townhouse</option>
                  </select>
                  {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                </div>

                {/* Min Lease Period */}
                <div>
                  <label htmlFor="minLeasePeriod" className="block text-gray-700 font-semibold mb-1">Min Lease Period (months)</label>
                  <input 
                    type="number" 
                    id="minLeasePeriod"
                    name="minLeasePeriod"
                    value={formData.minLeasePeriod}
                    onChange={handleInputChange}
                    className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.minLeasePeriod ? 'border-red-500' : ''}`}
                  />
                  {errors.minLeasePeriod && <p className="text-red-500 text-sm mt-1">{errors.minLeasePeriod}</p>}
                </div>

                {/* Max Lease Period */}
                <div>
                  <label htmlFor="maxLeasePeriod" className="block text-gray-700 font-semibold mb-1">Max Lease Period (months)</label>
                  <input 
                    type="number" 
                    id="maxLeasePeriod"
                    name="maxLeasePeriod"
                    value={formData.maxLeasePeriod}
                    onChange={handleInputChange}
                    className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.maxLeasePeriod ? 'border-red-500' : ''}`}
                  />
                  {errors.maxLeasePeriod && <p className="text-red-500 text-sm mt-1">{errors.maxLeasePeriod}</p>}
                </div>

                {/* Bedrooms */}
                <div>
                  <label htmlFor="bedrooms" className="block text-gray-700 font-semibold mb-1">Bedrooms</label>
                  <input 
                    type="number" 
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.bedrooms ? 'border-red-500' : ''}`}
                  />
                  {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
                </div>

                {/* Bathrooms */}
                <div>
                  <label htmlFor="bathrooms" className="block text-gray-700 font-semibold mb-1">Bathrooms</label>
                  <input 
                    type="number" 
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.bathrooms ? 'border-red-500' : ''}`}
                  />
                  {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
                </div>

                {/* Furnishing */}
                <div>
                  <label htmlFor="furnishing" className="block text-gray-700 font-semibold mb-1">
                    Furnishing
                  </label>
                  <select
                    id="furnishing"
                    name="furnishing"
                    value={formData.furnishing}
                    onChange={handleInputChange}
                    className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.furnishing ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select Furnishing</option>
                    <option value="Fully-Furnished">Fully-Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Not-Furnished">Not-Furnished</option>
                  </select>
                  {errors.furnishing && <p className="text-red-500 text-sm mt-1">{errors.furnishing}</p>}
                </div>
                
                {/* Rent per Month */}
                <div>
                  <label htmlFor="rentPerMonth" className="block text-gray-700 font-semibold mb-1">Rent per Month</label>
                  <input 
                    type="number" 
                    id="rentPerMonth"
                    name="rentPerMonth"
                    value={formData.rentPerMonth}
                    onChange={handleInputChange}
                    className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.rentPerMonth ? 'border-red-500' : ''}`}
                  />
                  {errors.rentPerMonth && <p className="text-red-500 text-sm mt-1">{errors.rentPerMonth}</p>}
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-golden-dark mb-3 border-b border-golden-light pb-2">Location Information</h3>
              
              {/* Location Selection Method */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Location Selection Method</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setLocationStep("select")}
                    className={`px-4 py-2 rounded-md ${
                      locationStep === "select" 
                        ? "bg-golden text-white" 
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Enter Address Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationStep("map")}
                    className={`px-4 py-2 rounded-md ${
                      locationStep === "map" 
                        ? "bg-golden text-white" 
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Select on Map
                  </button>
                </div>
              </div>
              
              {locationStep === "select" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* House Number/Name */}
                  <div>
                    <label htmlFor="houseNumber" className="block text-gray-700 font-semibold mb-1">House Number/Name</label>
                    <input 
                      type="text" 
                      id="houseNumber"
                      name="houseNumber"
                      value={formData.houseNumber}
                      onChange={handleInputChange}
                      className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.houseNumber ? 'border-red-500' : ''}`}
                    />
                    {errors.houseNumber && <p className="text-red-500 text-sm mt-1">{errors.houseNumber}</p>}
                  </div>

                  {/* Street */}
                  <div>
                    <label htmlFor="street" className="block text-gray-700 font-semibold mb-1">Street</label>
                    <input 
                      type="text" 
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.street ? 'border-red-500' : ''}`}
                    />
                    {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-gray-700 font-semibold mb-1">City</label>
                    <input 
                      type="text" 
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.city ? 'border-red-500' : ''}`}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  {/* District */}
                  <div>
                    <label htmlFor="district" className="block text-gray-700 font-semibold mb-1">District</label>
                    <input 
                      type="text" 
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.district ? 'border-red-500' : ''}`}
                    />
                    {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                  </div>

                  {/* State - Dropdown for Indian States */}
                  <div>
                    <label htmlFor="state" className="block text-gray-700 font-semibold mb-1">State</label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.state ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select State</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label htmlFor="pincode" className="block text-gray-700 font-semibold mb-1">Pincode</label>
                    <input 
                      type="text" 
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={`border w-full p-2 rounded-md focus:ring-2 focus:ring-golden ${errors.pincode ? 'border-red-500' : ''}`}
                    />
                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              ) : (
                <Map 
                  onLocationSelect={handleLocationSelect} 
                  selectedLocation={formData.mapLocation}
                />
              )}
              
              {/* Complete Address Preview */}
              {formData.address && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Complete Address:</h4>
                  <p className="text-gray-600">{formData.address}</p>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-golden-dark mb-3 border-b border-golden-light pb-2">Property Details</h3>
              <div className="grid grid-cols-1 gap-4">
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-gray-700 font-semibold mb-1">Property Description</label>
                  <textarea 
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`border w-full p-2 rounded-md h-20 resize-none focus:ring-2 focus:ring-golden ${errors.description ? 'border-red-500' : ''}`}
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
                
                {/* Rules */}
                <div>
                  <label htmlFor="rules" className="block text-gray-700 font-semibold mb-1">Rules</label>
                  <textarea 
                    id="rules"
                    name="rules"
                    value={formData.rules}
                    onChange={handleInputChange}
                    className={`border w-full p-2 rounded-md h-20 resize-none focus:ring-2 focus:ring-golden ${errors.rules ? 'border-red-500' : ''}`}
                  ></textarea>
                  {errors.rules && <p className="text-red-500 text-sm mt-1">{errors.rules}</p>}
                </div>

                {/* Cancellation Policy */}
                <div>
                  <label htmlFor="cancellationPolicy" className="block text-gray-700 font-semibold mb-1">Cancellation Policy</label>
                  <textarea 
                    id="cancellationPolicy"
                    name="cancellationPolicy"
                    value={formData.cancellationPolicy}
                    onChange={handleInputChange}
                    className={`border w-full p-2 rounded-md h-20 resize-none focus:ring-2 focus:ring-golden ${errors.cancellationPolicy ? 'border-red-500' : ''}`}
                  ></textarea>
                  {errors.cancellationPolicy && <p className="text-red-500 text-sm mt-1">{errors.cancellationPolicy}</p>}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-golden-dark mb-3 border-b border-golden-light pb-2">Features</h3>
              
              {/* Available Features */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Available Features</label>
                <div className="border w-full p-3 rounded-md grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {features.length > 0 ? (
                    features.map((feature) => (
                      <label key={feature._id} className="inline-flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 text-golden"
                          checked={formData.selectedFeatures.includes(feature._id)}
                          onChange={() => handleFeatureSelect(feature._id)}
                        />
                        <span>{feature.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-full">No features available</p>
                  )}
                </div>
              </div>
              
              {/* Other Features */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Other Features</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={otherFeatures}
                    onChange={(e) => setOtherFeatures(e.target.value)}
                    className="border w-full p-2 rounded-md focus:ring-2 focus:ring-golden"
                    placeholder="Add custom feature"
                  />
                  <button
                    type="button"
                    onClick={handleAddOtherFeature}
                    className="bg-golden text-white px-4 py-2 rounded-md shadow-md hover:bg-golden-dark transition"
                  >
                    Add
                  </button>
                </div>
                
                {formData.addedOtherFeatures.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.addedOtherFeatures.map((feature, index) => (
                      <div key={index} className="bg-gray-100 pl-3 pr-2 py-1 rounded-md flex items-center text-sm">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeOtherFeature(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-golden-dark mb-3 border-b border-golden-light pb-2">Property Images</h3>
              
              <div className="text-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3 bg-gray-50">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {formData.selectedImages.length > 0 ? (
                      formData.selectedImages.map((image, index) => (
                        <div key={index} className="relative w-24 h-24">
                          <img 
                            src={image} 
                            alt={`Upload ${index}`} 
                            className="w-full h-full object-cover rounded-lg border border-gray-300"
                          />
                          <button 
                            type="button"
                            onClick={() => removeImage(index)} 
                            className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 py-8 text-center w-full">
                        <p className="mb-2">No images selected</p>
                        <p className="text-sm">Click below to upload images</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <label className="inline-block cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  Select Images
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <motion.button 
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                className="bg-golden text-white px-6 py-2 rounded-md shadow-md hover:bg-golden-dark transition disabled:opacity-70"
              >
                {isSubmitting ? 'Adding...' : 'Add Property'}
              </motion.button>
              <motion.button 
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                className="border border-golden text-golden px-6 py-2 rounded-md shadow-md hover:bg-golden-light/30 transition"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default AddProperty;

