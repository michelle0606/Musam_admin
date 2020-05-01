import axios from 'axios'
import Swal from 'sweetalert2'

<<<<<<< HEAD
=======
// const baseURL = 'https://musam-server.herokuapp.com'
>>>>>>> 57c8d8ce7cf4920e67e26eed446fe254ed8ae757
const baseURL = 'http://localhost:3000'

export const apiHelper = axios.create({
  baseURL
})

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})
