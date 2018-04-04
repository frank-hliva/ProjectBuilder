import "toastr/build/toastr.css";
import * as toastr from "toastr";

(toastr as any).options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-center",
    preventDuplicates: false,
    showDuration: 300,
    hideDuration: 1000,
    timeOut: 4000,
    extendedTimeOut: 1000,
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
    closeOnHover: false
}

export default toastr;