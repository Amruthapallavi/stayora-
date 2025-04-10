import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Checkbox } from "../../components/ui/checkbox";
import { PlusCircle, Trash2, Save, ArrowLeft } from "lucide-react";
import { notifySuccess, notifyError } from '../../utils/notifications';
import { Link } from 'react-router-dom';
import { IProperty } from '../../types/IProperty';
import { Controller } from "react-hook-form";
import OwnerLayout from '../../components/owner/OwnerLayout';

// Define the schema for property form
const propertyFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.string().min(1, "Property type is required"),
  bedrooms: z.string().min(1, "Number of bedrooms is required"),
  bathrooms: z.string().min(1, "Number of bathrooms is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  district:z.string().min(1,"Distrcit is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.number().min(1, "pincode is required"),
  country: z.string().min(1, "Country is required"),
  rentPerMonth: z.string().min(1, "Monthly rent is required"),
  securityDeposit: z.string().min(1, "Security deposit is required"),
  availableFrom: z.string().min(1, "Available date is required"),
  minLeasePeriod: z.string().min(1, "Minimum lease period is required"),
  maxLeasePeriod: z.string().min(1, "Maximum lease period is required"),
  furnishing: z.string().min(1, "Furnishing status is required"),
  petPolicy: z.string().min(1, "Pet policy is required"),
  rules: z.string().optional(),
  cancellationPolicy: z.string().optional(),
});

// Interface for the property form
interface PropertyFormValues extends z.infer<typeof propertyFormSchema> {}

// Interface for PropertyForm data model
interface PropertyForm {
  title: string;
  description: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  address: string;
  city: string;
  district:string;
  state: string;
  pincode: string;
  country: string;
  rentPerMonth: number;
  securityDeposit: number;
  availableFrom: string;
  minLeasePeriod: string; // Changed to string to match the schema
  maxLeasePeriod: string; // Changed to string to match the schema
  furnishing: string;
  petPolicy: string;
  rules: string;
  cancellationPolicy: string;
  images: string[];
  features: string[];
  otherFeatures?: string[];
}

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPropertyById, listAllFeatures, updateProperty } = useAuthStore();
  
  const [property, setProperty] = useState<Partial<IProperty> | null>(null);
  const [loading, setLoading] = useState(true);
  const [allFeatures, setAllFeatures] = useState<any[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [otherFeatures, setOtherFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  
  // Setup form with validation
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      bedrooms: "",
      bathrooms: "",
      address: "",
      city: "",
      district:"",
      state: "",
      pincode: "",
      country: "",
      rentPerMonth: "",
      securityDeposit: "",
      availableFrom: "",
      minLeasePeriod: "",
      maxLeasePeriod: "",
      furnishing: "",
      petPolicy: "",
      rules: "",
      cancellationPolicy: "",
    },
  });
  
  // Load property data and features
  useEffect(() => {
    const loadPropertyAndFeatures = async () => {
      try {
        setLoading(true);
        
        // Load property
        const propertyResponse = await getPropertyById(id || '');
        // if (!propertyResponse.property) {
        //   notifyError('Property not found');
        //   navigate('/owner/properties');
        //   return;
        // }
        console.log(propertyResponse,"response")
        const propertyData = propertyResponse.Property;
        setProperty(propertyData);
        
        // Convert numeric fields to strings for the form
        form.reset({
          title: propertyData.title,
          description: propertyData.description,
          type: propertyData.type,
          bedrooms: String(propertyData.bedrooms),
          bathrooms: String(propertyData.bathrooms),
          address: propertyData.address,
          city: propertyData.city,
          state: propertyData.state,
          pincode: propertyData.pincode,
          district:propertyData.district,
          country: propertyData.country,
          rentPerMonth: String(propertyData.rentPerMonth),
        //   securityDeposit: String(propertyData.securityDeposit),
          availableFrom: propertyData.availableFrom,
          minLeasePeriod: String(propertyData.minLeasePeriod),
          maxLeasePeriod: String(propertyData.maxLeasePeriod),
          furnishing: propertyData.furnishing,
          rules: propertyData.rules || "",
          cancellationPolicy: propertyData.cancellationPolicy || "",
        });
        
        // Set images and features
        setImages(propertyData.images || []);
        setSelectedFeatures(propertyData.features || []);
        setOtherFeatures(propertyData.otherFeatures || []);
        
        // Load all available features
        const featuresResponse = await listAllFeatures();
        setAllFeatures(featuresResponse.features);
        
      } catch (error) {
        console.error('Error loading property data:', error);
        notifyError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    
    loadPropertyAndFeatures();
  }, [id, getPropertyById, listAllFeatures, navigate, form]);
  
  const handleSubmit = async (formData: PropertyFormValues) => {
    try {
      setSaving(true);
      
      // Prepare data for update
      const updateData: Partial<IProperty> = {
        ...formData,
        rentPerMonth: parseFloat(formData.rentPerMonth),
        // securityDeposit: parseFloat(formData.securityDeposit),
        minLeasePeriod: Number(formData.minLeasePeriod), // Keep as string to match schema
        maxLeasePeriod: Number(formData.maxLeasePeriod), // Keep as string to match schema
        images,
        features: selectedFeatures,
        // otherFeatures,
      };
      
      const result = await updateProperty(id || '', updateData);
      
      if (result.success) {
        notifySuccess('Property updated successfully');
        navigate(`/owner/view-property/${id}`);
      } else {
        notifyError(result.message || 'Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      notifyError('An error occurred while updating the property');
    } finally {
      setSaving(false);
    }
  };
  
  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(current => 
      current.includes(featureId) 
        ? current.filter(id => id !== featureId) 
        : [...current, featureId]
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
  
  // Add or remove image URLs
  const addImageUrl = (url: string) => {
    if (url.trim() && !images.includes(url.trim())) {
      setImages([...images, url.trim()]);
    }
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading property details...</div>;
  }
  
  if (!property) {
    return <div className="flex justify-center items-center h-screen">Property not found.</div>;
  }
  
  return (
    <OwnerLayout>
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={`/owner/view-property/${id}`} className="text-sm flex items-center text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Property Details
        </Link>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Edit Property</CardTitle>
          <CardDescription>Update your property details and features.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <div>
                  <Label htmlFor="title">Property Title</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="Enter property title"
                    className="mt-1"
                  />
                  {form.formState.errors.title && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Describe your property"
                    className="mt-1 min-h-[120px]"
                  />
                  {form.formState.errors.description && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="type">Property Type</Label>
                  <Select 
                    defaultValue={property.type}
                    onValueChange={(value) => form.setValue("type", value)}
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
                  {form.formState.errors.type && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.type.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      {...form.register("bedrooms")}
                      min="0"
                      className="mt-1"
                    />
                    {form.formState.errors.bedrooms && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.bedrooms.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      {...form.register("bathrooms")}
                      min="0"
                      step="0.5"
                      className="mt-1"
                    />
                    {form.formState.errors.bathrooms && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.bathrooms.message}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Location</h3>
                
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    {...form.register("address")}
                    placeholder="Enter street address"
                    className="mt-1"
                  />
                  {form.formState.errors.address && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.address.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...form.register("city")}
                      placeholder="city"
                      className="mt-1"
                    />
                    {form.formState.errors.city && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.city.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="state">District</Label>
                    <Input
                      id="district"
                      {...form.register("district")}
                      placeholder="district"
                      className="mt-1"
                    />
                    {form.formState.errors.district && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.district.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pincode">Zip/Postal Code</Label>
                    <Input
                      id="pincode"
                      {...form.register("pincode")}
                      placeholder="pincode"
                      className="mt-1"
                    />
                    {form.formState.errors.pincode && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.pincode.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="country">state</Label>
                    <Input
                      id="state"
                      {...form.register("state")}
                      placeholder="state"
                      className="mt-1"
                    />
                    {form.formState.errors.state && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.state.message}</p>
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
                      type="number"
                      {...form.register("rentPerMonth")}
                      min="0"
                      step="0.01"
                      className="mt-1"
                    />
                    {form.formState.errors.rentPerMonth && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.rentPerMonth.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="securityDeposit">Security Deposit ($)</Label>
                    <Input
                      id="securityDeposit"
                      type="number"
                      {...form.register("securityDeposit")}
                      min="0"
                      step="0.01"
                      className="mt-1"
                    />
                    {form.formState.errors.securityDeposit && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.securityDeposit.message}</p>
                    )}
                  </div>
                </div>
                
                {/* <div>
                  <Label htmlFor="availableFrom">Available From</Label>
                  <Input
                    id="availableFrom"
                    type="date"
                    {...form.register("availableFrom")}
                    className="mt-1"
                  />
                  {form.formState.errors.availableFrom && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.availableFrom.message}</p>
                  )}
                </div> */}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minLeasePeriod">Min Lease (months)</Label>
                    <Input
                      id="minLeasePeriod"
                      type="number"
                      {...form.register("minLeasePeriod")}
                      min="1"
                      className="mt-1"
                    />
                    {form.formState.errors.minLeasePeriod && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.minLeasePeriod.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="maxLeasePeriod">Max Lease (months)</Label>
                    <Input
                      id="maxLeasePeriod"
                      type="number"
                      {...form.register("maxLeasePeriod")}
                      min="1"
                      className="mt-1"
                    />
                    {form.formState.errors.maxLeasePeriod && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.maxLeasePeriod.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                <div>
  <Label htmlFor="furnishing">Furnishing</Label>
  <Controller
    control={form.control}
    name="furnishing"
    render={({ field }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger>
          <SelectValue placeholder="Select furnishing" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fully-Furnished">Furnished</SelectItem>
          <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
          <SelectItem value="Not-Furnished">Unfurnished</SelectItem>
        </SelectContent>
      </Select>
    )}
  />
  {form.formState.errors.furnishing && (
    <p className="text-red-500 text-sm mt-1">
      {form.formState.errors.furnishing.message}
    </p>
  )}
</div>

                  
                  <div>
                    {/* <Label htmlFor="petPolicy">Pet Policy</Label>
                    <Select 
                      defaultValue={property.petPolicy}
                      onValueChange={(value) => form.setValue("petPolicy", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pet policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pets Allowed">Pets Allowed</SelectItem>
                        <SelectItem value="No Pets">No Pets</SelectItem>
                        <SelectItem value="Case by Case">Case by Case</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.petPolicy && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.petPolicy.message}</p>
                    )} */}
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
                    {...form.register("rules")}
                    placeholder="House rules and restrictions"
                    className="mt-1 min-h-[120px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                  <Textarea
                    id="cancellationPolicy"
                    {...form.register("cancellationPolicy")}
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
                      checked={selectedFeatures.includes(feature._id)}
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
                    Add Image URL
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Image</DialogTitle>
                    <DialogDescription>
                      Enter the URL of the image you want to add.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex flex-col space-y-4 py-4">
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
                  
                  <DialogFooter>
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
                        Add Image
                      </Button>
                    </DialogClose>
                  </DialogFooter>
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
