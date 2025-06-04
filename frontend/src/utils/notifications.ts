import { toast } from "react-toastify";

export const notifySuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
  // style: {
  //     backgroundColor: '#b68451', 
  //     color: 'white',             
  //     borderRadius: '8px',
  //   },
    autoClose: 5000,
  });
};

export const notifyError = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
  });
};

export const notifyInfo = (message: string) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 5000,
  });
};

export const notifyWarn = (message: string) => {
  toast.warn(message, {
    position: "top-right",
    autoClose: 5000,
  });
};