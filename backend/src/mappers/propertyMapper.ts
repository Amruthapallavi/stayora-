import mongoose from "mongoose";
import { IProperty } from "../models/property.model";
import { PropertyResponseDTO } from "../DTO/PropertyDTO";

export const mapPropertyToDTO=(property: IProperty): PropertyResponseDTO =>{
  return {
    ownerId: property.ownerId.toString(),
    title: property.title,
    type: property.type,
    description: property.description,
    category: property.category ? property.category.toString() : null,
    mapLocation: property.mapLocation,
    address: property.address,
    houseNumber: property.houseNumber,
    street: property.street,
    city: property.city,
    district: property.district,
    state: property.state,
    pincode: property.pincode,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    furnishing: property.furnishing,
    rentPerMonth: property.rentPerMonth,
    images: property.images,
    minLeasePeriod: property.minLeasePeriod,
    maxLeasePeriod: property.maxLeasePeriod,
    rules: property.rules,
    cancellationPolicy: property.cancellationPolicy,
    features: property.features,
    otherFeatures: property.otherFeatures,
    status: property.status,
  };
}

export const mapPropertyToDTOs = (properties: IProperty[]): PropertyResponseDTO[] =>
  properties.map(mapPropertyToDTO);