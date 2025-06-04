import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  ArrowLeft,
  MapPin,
  BedDouble,
  Bath,
  Building,
  Home,
  Calendar,
  DollarSign,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import PropertyMap from "../../components/user/PropertyMap";

const ownerPropertyDetailedPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getPropertyById, deletePropertyById } = useAuthStore();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadPropertyAndFeatures();
  }, [id]);

  const loadPropertyAndFeatures = async () => {
    try {
      setLoading(true);

      const propertyResponse = await getPropertyById(id || "");
      if (!propertyResponse.Property) {
        notifyError("Property not found");
        return;
      }
      setProperty(propertyResponse.Property);
    } catch (error) {
      notifyError("Failed to load property details");
      console.error("Error loading property details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      console.log("Trying to delete property:", property?._id);
      const res = await deletePropertyById(propertyId);
      console.log(res, "for deleting property");
      if (res) {
        notifySuccess(res.message);
        navigate("/owner/properties");
      } else {
        notifyError("Failed to delete property");
      }
    } catch (error) {
      notifyError("An error occurred while deleting the property");
    }
  };

  // const handleShareProperty = () => {
  //   // Copy the public URL to clipboard
  //   const publicUrl = `${window.location.origin}/property/${id}`;
  //   navigator.clipboard.writeText(publicUrl);
  //   notifySuccess("Property link copied to clipboard");
  // };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* <Sidebar /> */}
        <div className="flex-1 p-4 md:p-8">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-10 w-10 border-t-2 border-golden rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* <Sidebar /> */}
        <div className="flex-1 p-4 md:p-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Property Not Found
            </h2>
            <p className="text-gray-500 mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/owner/properties">
              <Button className="bg-golden hover:bg-golden-dark">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with navigation */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <button
                onClick={() => navigate(`/owner/properties`)}
                className="text-gray-500 hover:text-gray-700 mr-3"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-golden-dark">
                {property.title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* <Button variant="outline" onClick={handleShareProperty} className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button> */}
              {property.status !== "rejected" &&
                property.status !== "booked" && (
                  <Link
                    to={`/owner/edit-property/${property._id}`}
                    className="flex-1 text-center border border-[#b68451] text-[#b68451] px-3 py-2 rounded font-medium hover:bg-[#e7d2aa] transition text-sm"
                  >
                    Edit
                  </Link>
                )}

              <Dialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Property</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this property? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setShowDeleteDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteProperty(property._id)}
                    >
                      Delete Property
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Property image gallery */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
              {property.images && property.images.length > 0 ? (
                <>
                  <div className="md:col-span-2 h-64 md:h-96">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 h-64 md:h-96">
                    {property.images
                      .slice(1, 3)
                      .map((image: string, index: number) => (
                        <div key={index} className="h-full">
                          <img
                            src={image}
                            alt={`${property.title} ${index + 2}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    {property.images.length > 3 && (
                      <div className="relative h-full col-span-2">
                        <img
                          src={property.images[3]}
                          alt={`${property.title} 4`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {property.images.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <span className="text-white text-xl font-semibold">
                              +{property.images.length - 4} more
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="col-span-3 h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                  <Home size={64} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Property details tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="rules">Rules & Policies</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            {/* Overview tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Property Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{property.description}</p>

                    <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-5 w-5 text-golden mr-2" />
                        <span>
                          {property.houseNumber} {property.street},{" "}
                          {property.city}, {property.state} {property.pincode}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>At a Glance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <BedDouble className="h-5 w-5 text-golden mr-2" />
                        <span>Bedrooms</span>
                      </div>
                      <span className="font-semibold">{property.bedrooms}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <Bath className="h-5 w-5 text-golden mr-2" />
                        <span>Bathrooms</span>
                      </div>
                      <span className="font-semibold">
                        {property.bathrooms}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-golden mr-2" />
                        <span>Property Type</span>
                      </div>
                      <span className="font-semibold">{property.type}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-golden mr-2" />
                        <span>Monthly Rent</span>
                      </div>
                      <span className="font-semibold">
                        ${property.rentPerMonth}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-golden mr-2" />
                        <span>Min. Lease</span>
                      </div>
                      <span className="font-semibold">
                        {property.minLeasePeriod} months
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-golden mr-2" />
                        <span>Max. Lease</span>
                      </div>
                      <span className="font-semibold">
                        {property.maxLeasePeriod} months
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Details tab */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Address
                      </h3>
                      <p>
                        {property.houseNumber} {property.street}
                      </p>
                      <p>
                        {property.city}, {property.state} {property.pincode}
                      </p>
                      {property.district && (
                        <p>District: {property.district}</p>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Property Information
                      </h3>
                      <p>Type: {property.type}</p>
                      <p>Bedrooms: {property.bedrooms}</p>
                      <p>Bathrooms: {property.bathrooms}</p>
                      <p>Furnishing: {property.furnishing}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Lease Terms
                      </h3>
                      <p>Rent: ${property.rentPerMonth}/month</p>
                      <p>Minimum Lease: {property.minLeasePeriod} months</p>
                      <p>Maximum Lease: {property.maxLeasePeriod} months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Location tab */}
            <TabsContent value="location">
              <Card>
                <CardHeader>
                  <CardTitle>Property Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {typeof property.mapLocation?.coordinates?.latitude ===
                      "number" &&
                      typeof property.mapLocation?.coordinates?.longitude ===
                        "number" && (
                        <PropertyMap
                          latitude={
                            property.mapLocation?.coordinates.latitude || 0
                          } // Default to 0 if latitude is null
                          longitude={
                            property.mapLocation?.coordinates.longitude || 0
                          } // Default to 0 if longitude is null
                          propertyTitle={property.title}
                        />
                      )}
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium">Address:</p>
                    <p>
                      {property.houseNumber} {property.street}, {property.city},{" "}
                      {property.state} {property.pincode}
                    </p>

                    {typeof property.mapLocation?.coordinates?.latitude ===
                      "number" &&
                      typeof property.mapLocation?.coordinates?.longitude ===
                        "number" && (
                        <p className="mt-2">
                          <span className="font-medium">Coordinates: </span>
                          {property.mapLocation.coordinates.latitude.toFixed(6)}
                          ,
                          {property.mapLocation.coordinates.longitude.toFixed(
                            6
                          )}
                        </p>
                      )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rules tab */}
            <TabsContent value="rules">
              <Card>
                <CardHeader>
                  <CardTitle>Rules & Policies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      House Rules
                    </h3>
                    <p className="text-gray-700">
                      {property.rules || "No specific rules provided."}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Cancellation Policy
                    </h3>
                    <p className="text-gray-700">
                      {property.cancellationPolicy ||
                        "No cancellation policy provided."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features tab */}
            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Features & Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 mb-3">
                      Property Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {property.features &&
                        property.features.map((featureId: string) => (
                          <Badge
                            key={featureId}
                            variant="secondary"
                            className="px-3 py-1"
                          >
                            {featureId}
                          </Badge>
                        ))}
                      {(!property.features ||
                        property.features.length === 0) && (
                        <p className="text-gray-500">No features specified</p>
                      )}
                    </div>
                  </div>

                  {property.otherFeatures &&
                    property.otherFeatures.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-3">
                          Other Features
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {property.otherFeatures.map(
                            (feature: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="px-3 py-1"
                              >
                                {feature}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ownerPropertyDetailedPage;
