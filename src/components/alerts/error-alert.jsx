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
        title: 'Oops...',
        text: error,
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return null;
};

export default ErrorAlert;
