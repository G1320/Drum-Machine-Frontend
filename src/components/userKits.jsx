// components/UserKits.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setKits } from '../slices/kitsSlice';
import axios from 'axios';

function UserKits() {
  const kits = useSelector((state) => state.kits.kits);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const { data } = await axios.get('/kits/my-kits', {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        dispatch(setKits(data));
      } catch (error) {
        console.error('Failed to fetch kits', error);
      }
    };
    fetchKits();
  }, [dispatch]);

  return (
    <div>
      {kits.map((kit) => (
        <div key={kit._id}>
          <h3>{kit.name}</h3>
          {/* Display other kit details */}
        </div>
      ))}
    </div>
  );
}

export default UserKits;
