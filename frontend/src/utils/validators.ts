
interface PropertyFormData {
  title: string;
  type: string;
  minLeasePeriod: string | number;
  maxLeasePeriod: string | number;
  bedrooms: string | number;
  bathrooms: string | number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  rentPerMonth: string | number;
  rules: string;
  cancellationPolicy: string;
  [key: string]: any;
}

export const validatePropertyForm = (formData: PropertyFormData) => {
  const errors: { [key: string]: string } = {};

  if (!formData.title?.trim()) {
    errors.title = "House title is required";
  }

  if (!formData.type?.trim()) {
    errors.type = "Property type is required";
  }

  if (!formData.minLeasePeriod) {
    errors.minLeasePeriod = "Minimum lease period is required";
  } else if (isNaN(Number(formData.minLeasePeriod))) {
    errors.minLeasePeriod = "Must be a valid number";
  } else if (Number(formData.minLeasePeriod) <= 0) {
    errors.minLeasePeriod = "Must be greater than 0";
  }

  if (!formData.maxLeasePeriod) {
    errors.maxLeasePeriod = "Maximum lease period is required";
  } else if (isNaN(Number(formData.maxLeasePeriod))) {
    errors.maxLeasePeriod = "Must be a valid number";
  } else if (Number(formData.maxLeasePeriod) <= 0) {
    errors.maxLeasePeriod = "Must be greater than 0";
  } else if (
    Number(formData.maxLeasePeriod) < Number(formData.minLeasePeriod)
  ) {
    errors.maxLeasePeriod = "Must be greater than min lease period";
  }

  if (!formData.bedrooms) {
    errors.bedrooms = "Number of bedrooms is required";
  } else if (isNaN(Number(formData.bedrooms))) {
    errors.bedrooms = "Must be a valid number";
  } else if (Number(formData.bedrooms) < 0) {
    errors.bedrooms = "Must be 0 or greater";
  }

  if (!formData.bathrooms) {
    errors.bathrooms = "Number of bathrooms is required";
  } else if (isNaN(Number(formData.bathrooms))) {
    errors.bathrooms = "Must be a valid number";
  } else if (Number(formData.bathrooms) < 0) {
    errors.bathrooms = "Must be 0 or greater";
  }

  if (!formData.address?.trim()) {
    errors.address = "Address is required";
  }

  if (!formData.city?.trim()) {
    errors.city = "City is required";
  }

  if (!formData.state?.trim()) {
    errors.state = "State is required";
  }
  if (!formData.furnishing) {
    errors.furnishing = "Please select a furnishing option.";
  }
  if (!formData.pincode?.trim()) {
    errors.pincode = "Pincode is required";
  } else if (!/^\d{5,6}$/.test(formData.pincode.toString())) {
    errors.pincode = "Must be a valid 5-6 digit pincode";
  }

  if (!formData.rentPerMonth) {
    errors.rentPerMonth = "Rent amount is required";
  } else if (isNaN(Number(formData.rentPerMonth))) {
    errors.rentPerMonth = "Must be a valid number";
  } else if (Number(formData.rentPerMonth) <= 0) {
    errors.rentPerMonth = "Must be greater than 0";
  }

  if (!formData.rules?.trim()) {
    errors.rules = "House rules are required";
  }
  if (!formData.description?.trim()) {
    errors.description = "Add Property desctiption ";
  }

  if (!formData.cancellationPolicy?.trim()) {
    errors.cancellationPolicy = "Cancellation policy is required";
  }

  return errors;
};
