import Swal from "sweetalert2";
import "./AlertStyles.css"; // Import custom styles (optional)

/**
 * Show a modern confirmation alert for toggling status (Block/Unblock)
 */
export const showStatusChangeAlert = async (action: string) => {
  return Swal.fire({
    title: `<span style="font-size: 20px; font-weight: 600; color: #333;">Confirm ${action}</span>`,
    html: `
      <div style="font-size: 16px; color: #555; padding: 10px 0;">
        Are you sure you want to <b style="color: ${action === "Block" ? "red" : "green"};">${action}</b> this user?<br>
        <span style="font-size: 14px; color: #888;">This action can be reverted later.</span>
      </div>`,
    icon: action === "Block" ? "error" : "info",
    showCancelButton: true,
    confirmButtonColor: action === "Block" ? "#e74c3c" : "#2ecc71",
    cancelButtonColor: "#95a5a6",
    confirmButtonText: `<i class="fas fa-check-circle"></i> Yes, ${action} it`,
    cancelButtonText: `<i class="fas fa-times-circle"></i> Cancel`,
    reverseButtons: true,
    customClass: {
      popup: "custom-swal-popup",
      title: "custom-swal-title",
      confirmButton: "custom-swal-confirm",
      cancelButton: "custom-swal-cancel",
    },
  });
};

/**
 * Show a stylish success alert
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
    confirmButtonColor: "#e74c3c",
  });
};
