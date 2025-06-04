// import { useState, useEffect } from "react";
// import Modal from "../../components/modal";
// import { Button } from "../ui/button";

// interface GoogleMapModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSelectLocation: (location: { lat: number; lng: number }) => void;
// }

// const GoogleMapModal: React.FC<GoogleMapModalProps> = ({ isOpen, onClose, onSelectLocation }) => {
//   const [map, setMap] = useState<google.maps.Map | null>(null);
//   const [marker, setMarker] = useState<google.maps.Marker | null>(null);
//   const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

//   useEffect(() => {
//     if (isOpen && window.google) {
//       const mapInstance = new google.maps.Map(document.getElementById("map") as HTMLElement, {
//         center: { lat: 20.5937, lng: 78.9629 }, // Default: India
//         zoom: 5,
//       });

//       setMap(mapInstance);

//       mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
//         if (marker) {
//           marker.setMap(null);
//         }

//         if (event.latLng) {
//           const newMarker = new google.maps.Marker({
//             position: event.latLng,
//             map: mapInstance,
//           });

//           setMarker(newMarker);
//           setSelectedLocation({
//             lat: event.latLng.lat(),
//             lng: event.latLng.lng(),
//           });
//         }
//       });
//     }
//   }, [isOpen]);

//   const handleConfirm = () => {
//     if (selectedLocation) {
//       onSelectLocation(selectedLocation);
//       onClose();
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose}>
//       <div className="p-4">
//         <h2 className="text-lg font-bold mb-2">Select Location</h2>
//         <div id="map" className="w-full h-64 bg-gray-300"></div>
//         <div className="mt-4 flex justify-end gap-2">
//           <Button onClick={onClose} variant="outline">Cancel</Button>
//           <Button onClick={handleConfirm} disabled={!selectedLocation}>Confirm</Button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default GoogleMapModal;
