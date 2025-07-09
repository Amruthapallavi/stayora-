


export interface IService{
    _id:string ,
    serviceId?:string,
    name: string;
    description: string;
    price: number;
    availability: boolean;
    status: "active" | "disabled";
    image: string; 
    contactMail:string;
    contactNumber:string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IServiceResponse {
  services: IService[];
}
export interface IServiceData {
  name: string;
  description: string;
  price: number; 
  image: string; 
  contactMail: string;
  contactNumber: string;
}


export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  contactMail: string;
  contactNumber: string;
  status: "active" | "disabled";
};