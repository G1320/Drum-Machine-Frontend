import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { clearError } from '../../slices/errorSlice';

const ErrorAlert = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.error.error);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: error,
        customClass: {
          container: 'error-alert-container',
          title: 'error-alert-title',
          content: 'error-alert-content',
        },
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return null;
};

export default ErrorAlert;
