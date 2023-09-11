import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKits } from '../services/kit-service';
import { useDispatch } from 'react-redux';
import { setError } from '../slices/errorSlice';

function KitDropdown() {
  const [kits, setKits] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');

  const filterRef = useRef();
  const sortByRef = useRef();
  const orderRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleError = (error) => {
    dispatch(setError(error?.response?.data || 'Something went wrong!'));
  };

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const params = {};
        if (filter) params.name = filter;
        if (sortBy) params.sortBy = sortBy;
        if (order) params.order = order;
        const data = await getKits(params);
        setKits(data);
      } catch (error) {
        handleError(error);
        console.error('Failed to load kit', error);
      }
    };
    fetchKits();
  }, [filter, sortBy, order, dispatch]);

  const handleFilterChange = () => {
    setFilter(filterRef.current.value);
  };

  const handleSortChange = () => {
    setSortBy(sortByRef.current.value);
    setOrder(orderRef.current.value);
  };

  const handleChange = (e) => {
    const selectedKitId = e.target.value;
    if (selectedKitId) {
      const selectedKit = kits.find((kit) => kit._id === selectedKitId);
      if (selectedKit) {
        navigate(`/pages/${selectedKit.name}`);
      }
    }
  };

  return (
    <div>
      <div>
        <label>
          Filter by name:
          <input type="text" ref={filterRef} onChange={handleFilterChange} />
        </label>
      </div>
      <div>
        <label>
          Sort by:
          <select ref={sortByRef} onChange={handleSortChange}>
            <option value="">None</option>
            <option value="name">Name</option>
          </select>
        </label>
        <label>
          Order:
          <select ref={orderRef} onChange={handleSortChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Kits:
          <select onChange={handleChange}>
            {kits.map((kit) => (
              <option key={kit._id} value={kit._id}>
                {kit.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default KitDropdown;
