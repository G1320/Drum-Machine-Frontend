import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { clearSuccess } from '../slices/successSlice';

const SuccessAlert = () => {
  const dispatch = useDispatch();
  const success = useSelector((state) => state.success.success);

  useEffect(() => {
    if (success) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: success,
      });
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  return null;
};

export default SuccessAlert;
