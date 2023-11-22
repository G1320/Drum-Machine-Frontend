import React, { useState, useEffect, useRef } from 'react';
import '../../assets/styles/components/kits/filter-kits.scss';
import { useNavigate, useLocation } from 'react-router-dom';

import { getKits } from '../../services/kit-service';
import { useDispatch } from 'react-redux';
import { setError } from '../../slices/errorSlice';
import { useParams } from 'react-router-dom';

function KitFilter() {
  const [kits, setKits] = useState([]);
  const [selectedKit, setSelectedKit] = useState('');

  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');

  // const filterRef = useRef();
  // const sortByRef = useRef();
  // const orderRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { kitId } = useParams();

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
  }, [kitId, filter, sortBy, order, dispatch]);

  useEffect(() => {
    const getSelectedKit = async () => {
      try {
        if (kitId) setSelectedKit(kitId);
      } catch (error) {
        console.error('Failed to load selected kit', error);
      }
    };
    getSelectedKit();
  }, [kitId]);

  // const handleFilterChange = () => {
  //   setFilter(filterRef.current.value);
  // };

  // const handleSortChange = () => {
  //   setSortBy(sortByRef.current.value);
  //   setOrder(orderRef.current.value);
  // };

  const handleChange = (e) => {
    const selectedKitId = e.target.value;
    setSelectedKit(selectedKitId);
    if (selectedKitId) {
      const selectedKit = kits.find((kit) => kit._id === selectedKitId);
      if (selectedKit) {
        const locationParts = location.pathname.split('/');
        const locationPath = locationParts[1];
        if (locationPath === 'drum') {
          navigate(`/drum/id/${selectedKit._id}`);
        } else if (locationPath === 'sequencer') {
          navigate(`/sequencer/id/${selectedKit._id}`);
        }
      }
    }
  };

  return (
    <>
      {/* <div className="kit-filter-input">
        <input
          type="text"
          className="filter-input"
          ref={filterRef}
          onChange={handleFilterChange}
          value={filter}
          placeholder="Search"
        />
        <label>Search</label>
      </div> */}
      <article className="select-kit">
        <div>Select Kit:</div>
        <select
          className="filter-select "
          value={selectedKit}
          onChange={handleChange}
          placeholder="Select a kit"
        >
          <option value="" disabled>
            Select a kit
          </option>
          {kits.map((kit) => (
            <option key={kit._id} value={kit._id}>
              {kit.name}
            </option>
          ))}
        </select>
        {/* <label>Kit</label> */}
      </article>
      {/* <article className="sort-by">
        <select
          className="filter-select"
          value={sortBy}
          onChange={handleSortChange}
          placeholder="Sort by"
        >
          <option value="" disabled>
            Sort by
          </option>
          <option value="">None</option>
          <option value="name">Name</option>
        </select>
        <label>Sort by</label>
      </article> */}
      {/* <article className="order">
        <select
          className="filter-select"
          value={order}
          ref={orderRef}
          onChange={handleSortChange}
          placeholder="Order"
        >
          <option value="" disabled>
            Order
          </option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <label>Order</label>
      </article> */}
    </>
  );
}

export default KitFilter;
