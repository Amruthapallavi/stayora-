import Swal from "sweetalert2";

/**
 * Show a confirmation alert with customizable options
 */
export const showConfirmAlert = async (
  title: string,
  message: string,
  confirmText: string = "Yes",
  cancelText: string = "No"
) => {
  return Swal.fire({
    title,
    html: `<div style="font-size: 16px; color: #555;">
                ${message}<br>
                <strong style="color: red;">This action cannot be undone!</strong>
             </div>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ff4d4d",
    cancelButtonColor: "#4CAF50",
    confirmButtonText: `<b>${confirmText}</b>`,
    cancelButtonText: `<b>${cancelText}</b>`,
    reverseButtons: true,
    customClass: {
      popup: "rounded-lg shadow-lg",
      title: "text-gray-700 font-semibold",
      confirmButton: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded",
      cancelButton: "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded",
    },
  });
};

/**
 * Show a success alert with auto-close
 */
export const showSuccessAlert = (message: string) => {
  return Swal.fire({
    title: "Success!",
    text: message,
    icon: "success",
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
  });
};

/**
 * Show an error alert
 */
export const showErrorAlert = (message: string) => {
  return Swal.fire({
    title: "Error!",
    text: message,
    icon: "error",
    confirmButtonColor: "#d33",
  });
};
