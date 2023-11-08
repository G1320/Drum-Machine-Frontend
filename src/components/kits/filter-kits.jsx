import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/components/kits/filter-kits.css';
import { getKits } from '../../services/kit-service';
import { useDispatch } from 'react-redux';
import { setError } from '../../slices/errorSlice';
import { Select, MenuItem, TextField, InputLabel, FormHelperText, FormGroup } from '@mui/material';

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

  // <FormGroup>
  //   <TextField
  //     label="Kit Name"
  //     variant="outlined"
  //     value={kitName}
  //     onChange={(e) => setKitName(e.target.value)}
  //   />
  // </FormGroup>;

  return (
    <section className="kit-filter">
      <FormGroup className="kit-filter-input">
        <TextField
          // label="Search "
          variant="outlined"
          size="small"
          inputRef={filterRef}
          onChange={handleFilterChange}
        />
        <FormHelperText>Search</FormHelperText>
      </FormGroup>
      <article>
        <Select
          className="filter-select"
          labelId="all-kits-label"
          value={selectedKit}
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select a kit
          </MenuItem>
          {kits.map((kit) => (
            <MenuItem key={kit._id} value={kit._id}>
              {kit.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Kit</FormHelperText>
      </article>
      <article className="sort-by">
        <Select
          className="filter-select"
          labelId="sort-by-label"
          value={sortBy}
          onChange={handleSortChange}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Sort by
          </MenuItem>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="name">Name</MenuItem>
        </Select>
        <FormHelperText>Sort by</FormHelperText>
      </article>
      <article className="order">
        <Select
          className="filter-select"
          labelId="order-label"
          value={order}
          ref={orderRef}
          onChange={handleSortChange}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Order
          </MenuItem>
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
        <FormHelperText>Order</FormHelperText>
      </article>
    </section>
  );
}

export default KitFilter;
