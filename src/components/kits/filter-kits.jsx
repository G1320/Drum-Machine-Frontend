import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/components/kits/kit-filter.css';
import { getKits } from '../../services/kit-service';
import { useDispatch } from 'react-redux';
import { setError } from '../../slices/errorSlice';

function KitFilter() {
  const [kits, setKits] = useState([]);
  const [selectedKit, setSelectedKit] = useState('');

  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');

  const filterRef = useRef();
  const sortByRef = useRef();
  const orderRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        dispatch(setError(error?.response?.data || 'Something went wrong!'));
        console.error('Failed to load kit', error);
      }
    };
    fetchKits();
  }, [filter, sortBy, order, dispatch, kits]);

  const handleFilterChange = () => {
    setFilter(filterRef.current.value);
  };

  const handleSortChange = () => {
    setSortBy(sortByRef.current.value);
    setOrder(orderRef.current.value);
  };

  const handleChange = (e) => {
    const selectedKitId = e.target.value;
    setSelectedKit(selectedKitId);
    if (selectedKitId) {
      const selectedKit = kits.find((kit) => kit._id === selectedKitId);
      if (selectedKit) {
        navigate(`/drum/id/${selectedKit._id}`);
      }
    }
  };

  return (
    <div className="kit-filter">
      <div>
        <h3>
          Filter by name:
          <input type="text" ref={filterRef} onChange={handleFilterChange} />
        </h3>
      </div>
      <div className="sort-by">
        <label>
          Sort by:
          <select ref={sortByRef} onChange={handleSortChange}>
            <option value="">None</option>
            <option value="name">Name</option>
          </select>
          <br />
        </label>
      </div>
      <div className="order">
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
          All kits:
          <select value={selectedKit} onChange={handleChange}>
            <option value="" disabled>
              Select a kit
            </option>
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

export default KitFilter;
