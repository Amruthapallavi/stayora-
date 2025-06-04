import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Checkbox } from "../../components/ui/checkbox";
import { PlusCircle, Trash2, Save, ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import { notifySuccess, notifyError } from '../../utils/notifications';
import { Link } from 'react-router-dom';
import { Feature, FormData, FormErrors, IProperty } from '../../types/property';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";


const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPropertyById, listAllFeatures, updateProperty } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    address: "",
    houseNumber:"",
    street:"",
    city: "",
    district: "",
    state: "",
    pincode: "",
    rentPerMonth: "",
    minLeasePeriod: "",
    maxLeasePeriod: "",
    furnishing: "",
    rules: "",
    selectedImages: [],
    cancellationPolicy: "",
  });
  
  // Form errors state
  const [formErrors, setFormErrors] = useState<FormErrors>({
    title: "",
    description: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    address: "",
    houseNumber:"",
    street:"",
    city: "",
    district: "",
    state: "",
    pincode: "",
    rentPerMonth: "",
    minLeasePeriod: "",
    maxLeasePeriod: "",
    furnishing: "",
    selectedImages: [],
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [otherFeatures, setOtherFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  useEffect(() => {
    const loadPropertyAndFeatures = async () => {
      try {
        setLoading(true);
        
        const propertyResponse = await getPropertyById(id || '');
        
        const propertyData = propertyResponse.Property;
        
        setFormData({
          title: propertyData.title || "",
          description: propertyData.description || "",
          type: propertyData.type || "",
          bedrooms: String(propertyData.bedrooms) || "",
          bathrooms: String(propertyData.bathrooms) || "",
          address: propertyData.address || "",
          houseNumber:propertyData.houseNumber || "",
          street: propertyData.street||"",
          city: propertyData.city || "",
          district: propertyData.district || "",
          state: propertyData.state || "",
          pincode: String(propertyData.pincode) || "",
          rentPerMonth: String(propertyData.rentPerMonth) || "",
          minLeasePeriod: String(propertyData.minLeasePeriod) || "",
          maxLeasePeriod: String(propertyData.maxLeasePeriod) || "",
          furnishing: propertyData.furnishing || "",
          rules: propertyData.rules || "",
          selectedImages: [],
          cancellationPolicy: propertyData.cancellationPolicy || "",
        });
        
        setImages(propertyData.images || []);
        setSelectedFeatures(propertyData.features || []);
        setOtherFeatures(propertyData.otherFeatures || []);
        
        const featuresResponse = await listAllFeatures();
        console.log(featuresResponse,"feature response")
        setAllFeatures(featuresResponse?.features);
        
      } catch (error) {
        console.error('Error loading property data:', error);
        notifyError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    
    loadPropertyAndFeatures();
  }, [id, getPropertyById, listAllFeatures]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value,
    };
   
    
      updatedData.address = `${updatedData.houseNumber || ''}, ${updatedData.street || ''}, ${updatedData.city || ''}, ${updatedData.district || ''}, ${updatedData.state || ''}, ${updatedData.pincode || ''}`
        .replace(/(, )+/g, ', ') 
        .replace(/^, |, $/g, ''); 
    
      setFormData(updatedData);
    
    
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
  };
  
  const toggleFeature = (id: string) => {
    const feature = allFeatures.find((f) => f._id === id);
    if (!feature) return;
  
    const featureName = feature.name;
  
    setSelectedFeatures((prev) =>
      prev.includes(featureName)
        ? prev.filter((name) => name !== featureName)
        : [...prev, featureName]
    );
  };
  
  
  const addOtherFeature = () => {
    if (newFeature.trim() && !otherFeatures.includes(newFeature.trim())) {
      setOtherFeatures([...otherFeatures, newFeature.trim()]);
      setNewFeature("");
    }
  };
  
  const removeOtherFeature = (feature: string) => {
    setOtherFeatures(otherFeatures.filter(f => f !== feature));
  };
  
  const addImageUrl = (url: string) => {
    if (url.trim() && !images.includes(url.trim())) {
      setImages([...images, url.trim()]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setSelectedFile(file);
    }
  };
  
  const handleAddImageFile = () => {
    if (!selectedFile) return;
    
    setNewImageFiles([...newImageFiles, selectedFile]);
    
    const tempUrl = URL.createObjectURL(selectedFile);
    setImages([...images, tempUrl]);
    
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    notifySuccess('Image added to property');
  };
  
  const removeImage = (index: number) => {
    if (index >= images.length - newImageFiles.length) {
      const newFileIndex = index - (images.length - newImageFiles.length);
      setNewImageFiles(newImageFiles.filter((_, i) => i !== newFileIndex));
    }
    
    setImages(images.filter((_, i) => i !== index));
  };
  
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;
    
    if (!formData.title || formData.title.length < 5) {
      errors.title = "Title must be at least 5 characters";
      isValid = false;
    }
    
    if (!formData.description || formData.description.length < 20) {
      errors.description = "Description must be at least 20 characters";
      isValid = false;
    }
    
    if (!formData.type) {
      errors.type = "Property type is required";
      isValid = false;
    }
    
    if (!formData.bedrooms) {
      errors.bedrooms = "Number of bedrooms is required";
      isValid = false;
    }
    
    if (!formData.bathrooms) {
      errors.bathrooms = "Number of bathrooms is required";
      isValid = false;
    }
    
    if (!formData.address || formData.address.length < 5) {
      errors.address = "Address must be at least 5 characters";
      isValid = false;
    }
    
    if (!formData.city) {
      errors.city = "City is required";
      isValid = false;
    }
    
    if (!formData.district) {
      errors.district = "District is required";
      isValid = false;
    }
    
    if (!formData.state) {
      errors.state = "State is required";
      isValid = false;
    }
    
    if (!formData.pincode) {
      errors.pincode = "Pincode is required";
      isValid = false;
    }
    
    if (!formData.rentPerMonth) {
      errors.rentPerMonth = "Monthly rent is required";
      isValid = false;
    }
    
    if (!formData.minLeasePeriod) {
      errors.minLeasePeriod = "Minimum lease period is required";
      isValid = false;
    }
    
    if (!formData.maxLeasePeriod) {
      errors.maxLeasePeriod = "Maximum lease period is required";
      isValid = false;
    }
    
    if (!formData.furnishing) {
      errors.furnishing = "Furnishing status is required";
      isValid = false;
    }
    if (!formData.maxLeasePeriod) {
      errors.maxLeasePeriod = "Maximum lease period is required";
      isValid = false;
    }
    
    if (!formData.furnishing) {
      errors.furnishing = "Furnishing details are required";
      isValid = false;
    }
    if (!formData.street) {
      errors.furnishing = "street details are required";
      isValid = false;
    }
    if (!formData.houseNumber) {
      errors.furnishing = "House name or number details are required";
      isValid = false;
    }
    
    if (images.length === 0) {
      errors.selectedImages = ["At least one image is required"];
      isValid = false;
    }
    
   
    
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      notifyError("Please fix the form errors before submitting");
      return;
    }
    
    try {
      setSaving(true);
    
      const updatedProperty: Partial<IProperty> = {
        ...formData,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        pincode: Number(formData.pincode),
        rentPerMonth: Number(formData.rentPerMonth),
        minLeasePeriod: Number(formData.minLeasePeriod),
        maxLeasePeriod: Number(formData.maxLeasePeriod),
        features: selectedFeatures,
        otherFeatures,
        images, 
      };
    
      await updateProperty(id || '', updatedProperty, newImageFiles); 
    
      notifySuccess("Property updated successfully");
      navigate(`/owner/property/${id}`);
    } catch (error) {
      console.error("Failed to update property:", error);
      notifyError("Failed to update property. Please try again.");
    } finally {
      setSaving(false);
    }
    
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading property details...</div>;
  }
  
  return (
    <OwnerLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={`/owner/properties`} className="text-sm flex items-center text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Property Details
          </Link>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Edit Property</CardTitle>
            <CardDescription>Update your property details and features.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  
                  <div>
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter property title"
                      className="mt-1"
                    />
                    {formErrors.title && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your property"
                      className="mt-1 min-h-[120px]"
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Property Type</Label>
                    <Select 
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Condo">Condo</SelectItem>
                        <SelectItem value="Townhouse">Townhouse</SelectItem>
                        <SelectItem value="Studio">Studio</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.type && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.type}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        name="bedrooms"
                        type="number"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        min="0"
                        className="mt-1"
                      />
                      {formErrors.bedrooms && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.bedrooms}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        name="bathrooms"
                        type="number"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        min="0"
                        step="0.5"
                        className="mt-1"
                      />
                      {formErrors.bathrooms && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.bathrooms}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Location</h3>
                  
                  <Input
  id="address"
  name="address"
  value={formData.address}
  readOnly
  placeholder="Enter street address"
  className="mt-1 bg-gray-100 cursor-not-allowed"
/>

                  
                  <div className="grid grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="houseNumber">House No:</Label>
                      <Input
                        id="houseNumber"
                        name="houseNumber"
                        value={formData.houseNumber}
                        onChange={handleInputChange}
                        placeholder="houseNumber"
                        className="mt-1"
                      />
                      {formErrors.houseNumber && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="houseNumber">Street:</Label>
                      <Input
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder="Street"
                        className="mt-1"
                      />
                      {formErrors.street && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="city"
                        className="mt-1"
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="district"
                        className="mt-1"
                      />
                      {formErrors.district && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.district}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pincode">Zip/Postal Code</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="pincode"
                        className="mt-1"
                      />
                      {formErrors.pincode && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.pincode}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="state"
                        className="mt-1"
                      />
                      {formErrors.state && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Rental Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Rental Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rentPerMonth">Monthly Rent ($)</Label>
                      <Input
                        id="rentPerMonth"
                        name="rentPerMonth"
                        type="number"
                        value={formData.rentPerMonth}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="mt-1"
                      />
                      {formErrors.rentPerMonth && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.rentPerMonth}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minLeasePeriod">Min Lease (months)</Label>
                      <Input
                        id="minLeasePeriod"
                        name="minLeasePeriod"
                        type="number"
                        value={formData.minLeasePeriod}
                        onChange={handleInputChange}
                        min="1"
                        className="mt-1"
                      />
                      {formErrors.minLeasePeriod && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.minLeasePeriod}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="maxLeasePeriod">Max Lease (months)</Label>
                      <Input
                        id="maxLeasePeriod"
                        name="maxLeasePeriod"
                        type="number"
                        value={formData.maxLeasePeriod}
                        onChange={handleInputChange}
                        min="1"
                        className="mt-1"
                      />
                      {formErrors.maxLeasePeriod && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.maxLeasePeriod}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="furnishing">Furnishing</Label>
                      <Select 
                        value={formData.furnishing}
                        onValueChange={(value) => handleSelectChange("furnishing", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select furnishing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fully-Furnished">Furnished</SelectItem>
                          <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
                          <SelectItem value="Not-Furnished">Unfurnished</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.furnishing && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.furnishing}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Policies */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Policies</h3>
                  
                  <div>
                    <Label htmlFor="rules">House Rules</Label>
                    <Textarea
                      id="rules"
                      name="rules"
                      value={formData.rules}
                      onChange={handleInputChange}
                      placeholder="House rules and restrictions"
                      className="mt-1 min-h-[120px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                    <Textarea
                      id="cancellationPolicy"
                      name="cancellationPolicy"
                      value={formData.cancellationPolicy}
                      onChange={handleInputChange}
                      placeholder="Describe your cancellation policy"
                      className="mt-1 min-h-[120px]"
                    />
                  </div>
                </div>
              </div>
              
              {/* Features and Amenities */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Features and Amenities</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allFeatures.map((feature) => (
                    <div key={feature._id} className="flex items-center space-x-2">
                     <Checkbox
  id={feature._id}
  checked={selectedFeatures.includes(feature.name)}
  onCheckedChange={() => toggleFeature(feature._id)}
/>

                      <Label htmlFor={feature._id} className="text-sm">
                        {feature.name}
                      </Label>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="text-md font-medium mb-2">Other Features</h4>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {otherFeatures.map((feature, index) => (
                      <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                        <span className="text-sm">{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeOtherFeature(feature)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add other feature"
                      className="max-w-xs"
                    />
                    <Button type="button" size="sm" onClick={addOtherFeature}>
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Images */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Property Images</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="h-40 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Image</DialogTitle>
                      <DialogDescription>
                        Upload an image file or enter an image URL.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Tabs defaultValue="file" className="w-full pt-2">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="file">Upload File</TabsTrigger>
                        <TabsTrigger value="url">Image URL</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="file" className="py-4">
                        <div className="flex flex-col space-y-4">
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="image-upload">Upload Image</Label>
                            <Input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              className="mt-1"
                              onChange={handleFileChange}
                              ref={fileInputRef}
                            />
                          </div>
                          
                          {filePreview && (
                            <div className="mt-4">
                              <Label>Preview</Label>
                              <div className="mt-2 border rounded-md p-2 flex justify-center">
                                <img 
                                  src={filePreview} 
                                  alt="Preview" 
                                  className="max-h-40 object-contain"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <Button 
                            type="button" 
                            disabled={!selectedFile}
                            onClick={handleAddImageFile}
                          >
                            Add Image
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="url" className="py-4">
                        <div className="flex flex-col space-y-4">
                          <div>
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input
                              id="imageUrl"
                              placeholder="https://example.com/image.jpg"
                              className="mt-1"
                              name="newImageUrl"
                            />
                          </div>
                        </div>
                        
                        <DialogFooter className="mt-4">
                          <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button onClick={() => {
                              const input = document.querySelector('input[name="newImageUrl"]') as HTMLInputElement;
                              if (input && input.value) {
                                addImageUrl(input.value);
                              }
                            }}>
                              Add Image URL
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end mt-8">
                <Button type="submit" disabled={saving} className="flex items-center gap-2">
                  {saving ? 'Saving...' : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </OwnerLayout>
  );
};

export default EditProperty;