import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, CheckCircle, Unlock, X, Ban, Trash2, PlusCircle, Filter, FilterX } from "lucide-react";
import StatusBadge from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { useAuthStore } from '../../stores/authStore';
import { IProperty } from '../../types/IProperty';
import { cn } from '../../lib/utils';
import AdminLayout from '../../components/admin/AdminLayout';
import TooltipWrapper from '../../components/ToolTip';
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from '../../components/ConfirmationAlert';
import { showStatusChangeAlert } from '../../components/alert/AlertService';
import Swal from "sweetalert2";
import { notifySuccess } from '../../utils/notifications';
const AdminProperties: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [filteredProperties, setFilteredProperties] = useState<IProperty[]>([]);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const { getAllProperties ,rejectProperty,approveProperty,blockUnblockProperty,deleteProperty
  } = useAuthStore();
  const propertyPerPage=5;

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const res = await getAllProperties();
        setProperties(res.properties);
        setFilteredProperties(res.properties);
        // setTotalPages(res.totalPages);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProperties();
  }, [currentPage, getAllProperties]);
  
console.log(properties)
  const applyFilters = (query: string, status: string | null) => {
    let filtered = [...properties];

    if (query.trim()) {
      filtered = filtered.filter((property) =>
        property.title.toLowerCase().includes(query.toLowerCase()) ||
        property._id.toLowerCase().includes(query.toLowerCase()) ||
        property.address.toLowerCase().includes(query.toLowerCase()) ||
        property?.ownerId?.name.toLowerCase().includes(query.toLowerCase())
)
    }

    if (status) {
      filtered = filtered.filter((property) => property.status === status);
    }

    setFilteredProperties(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    applyFilters(query, statusFilter);
  };

  const indexOfLastProperty = currentPage * propertyPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertyPerPage;
  const currentProperty = properties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(properties.length / propertyPerPage);
  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
    applyFilters(searchQuery, status);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
    setFilteredProperties(properties);
  };

  const handleApprove = async (propertyId: string) => {
    try {
      const confirmed = await showConfirmAlert(
        "Are you sure?",
        "Do you want to approve this property?"
      );
  
      if (confirmed) {
        await approveProperty(propertyId);
        showSuccessAlert("Property approved successfully");
        
        setFilteredProperties(filteredProperties.filter(property => property._id !== propertyId));
        window.location.reload();
      }
    } catch (error) {
      console.error("Approval failed", error);
      showErrorAlert("Something went wrong while approving");
    }
  };
  

  
  const handleBlockUnblock = async (
    propertyId: string,
    currentStatus: "active" | "blocked"
  ) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
  
    try {
      const confirmed = await showStatusChangeAlert(
        `Change status to ${newStatus}?`,
      );
  
      if (confirmed) {
        await blockUnblockProperty(propertyId, newStatus);
        showSuccessAlert(`Property ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`);
      }
      window.location.reload(); // Reload page after approval

    } catch (error) {
      console.error("Block/Unblock failed", error);
      showErrorAlert(`Failed to ${newStatus} the property`);
    }
  };
  
  const handleDelete = async (propertyId: string) => {
    try {
      const confirmed = await showConfirmAlert(
        "Are you sure?",
        "This action will permanently delete the property."
      );
  
      if (confirmed) {
        await deleteProperty(propertyId);
        showSuccessAlert("Property deleted successfully");
        window.location.reload(); // Reload page after delete
      }
    } catch (error) {
      console.error("Delete failed", error);
      showErrorAlert("Something went wrong while deleting");
    }
  };
  
  

const handleReject = async (propertyId:string) => {
  try {
    const { value: reason } = await Swal.fire({
      title: "Reason for Rejection",
      input: "textarea",
      inputLabel: "Please enter a reason",
      inputPlaceholder: "Type your reason here...",
      inputAttributes: {
        "aria-label": "Reason",
      },
      showCancelButton: true,
    });

    if (!reason) return;

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to reject this property.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    });

    if (confirm.isConfirmed) {
      console.log("Rejected property ID:", propertyId);
      console.log("Reason:", reason);
      const response= await rejectProperty(propertyId,reason);
      console.log(response,"checking");
      notifySuccess(response?.message);
window.location.reload();
      // Call your backend API here if needed
      // await rejectProperty(propertyId, reason);
    }
  } catch (error) {
    console.error("Error during rejection:", error);
    Swal.fire("Error", "Something went wrong. Please try again.", "error");
  }
};


  const handleRowClick = (property: IProperty) => {
    navigate(`/admin/properties/${property._id}`);
  };
  const handlePageChange = async (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      try {
        setIsLoading(true);
        const res = await getAllProperties(page);
        setProperties(res.properties);
        setFilteredProperties(res.properties);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Property Management</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Property
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search properties..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                {statusFilter ? `Status: ${statusFilter}` : 'Filter Status'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusFilter('pending')}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('approved')}>Approved</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('rejected')}>Rejected</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter(null)}>All Statuses</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {(searchQuery || statusFilter) && (
            <Button variant="ghost" onClick={handleClearFilters}>
              <FilterX className="mr-2 h-4 w-4" /> Clear
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No properties found matching your search.</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-sm rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Type', 'Owner', 'Price', 'Status', 'Actions'].map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProperty.map((property, index) => (
                <tr
                  key={index}
                  className={cn('hover:bg-gray-50', 'cursor-pointer')}
                  onClick={() => handleRowClick(property)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0">
                        <img
                          src={property.images?.[0] || 'https://placehold.co/100x100?text=No+Image'}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>{property.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{property.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{property?.ownerId?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">₹{property.rentPerMonth}/month</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge status={property.status} />
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {property.rating > 0
                      ? `${property.rating} (${property.reviews} reviews)`
                      : 'No ratings'}
                  </td> */}
                  
    <tr key={property._id} className="border-b hover:bg-gray-100">

  
<td className="px-6 py-4 whitespace-nowrap text-sm text-right">
  <div className="flex space-x-3 justify-end text-gray-700">
    {/* View */}
    <TooltipWrapper content="View">
      <Eye
        size={18}
        className="cursor-pointer hover:text-blue-600"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/admin/properties/${property._id}`);
        }}
      />
    </TooltipWrapper>

    {property.status === "pending" && (
      <>
        <TooltipWrapper content="Approve">
          <CheckCircle
            size={18}
            className="cursor-pointer text-green-500 hover:text-green-600"
            onClick={(e) => {
              e.stopPropagation();
              handleApprove(property._id);
              console.log("Approve property", property._id);
            }}
          />
        </TooltipWrapper>
        <TooltipWrapper content="Reject">
  <X
    size={18}
    className="cursor-pointer text-red-500 hover:text-red-600"
    onClick={(e) => {
      e.stopPropagation();
      handleReject(property._id);
    }}
  />
</TooltipWrapper>

      </>
    )}

    {property.status === "active" && (
      <>
        <TooltipWrapper content="Block">
          <Ban
            size={18}
            className="cursor-pointer text-yellow-600 hover:text-yellow-700"
            onClick={(e) => {
              e.stopPropagation();
              handleBlockUnblock(property._id, property.status);
            }}
          />
        </TooltipWrapper>
        <TooltipWrapper content="Delete">
          <Trash2
            size={18}
            className="cursor-pointer text-red-500 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(property._id);
            }}
          />
        </TooltipWrapper>
      </>
    )}

    {property.status === "blocked" && (
      <>
        <TooltipWrapper content="Unblock">
          <CheckCircle
            size={18}
            className="cursor-pointer text-green-500 hover:text-green-600"
            onClick={(e) => {
              e.stopPropagation();
              handleBlockUnblock(property._id, property.status);
            }}
          />
        </TooltipWrapper>
        <TooltipWrapper content="Delete">
          <Trash2
            size={18}
            className="cursor-pointer text-red-500 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Delete property", property._id);
            }}
          />
        </TooltipWrapper>
      </>
    )}
  </div>
</td>

</tr>


                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
          <div className="flex justify-between items-center mt-6">
          <button className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          <span className="text-gray-700 font-semibold">Page {currentPage} of {totalPages}</span>
          <button className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>

    </div>
    </AdminLayout>
  );
};

export default AdminProperties;
