import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../assets/styles/components/kits/filter-kits.scss';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { getKits, getKitById } from '../../services/kit-service';
import { setError } from '../../slices/errorSlice';
import { setSelectedKit, setAllKits, setUserKits, setCombinedKits } from '../../slices/kitsSlice';
import { getLocalUser } from '../../services/user-service';
import { getUserKits } from '../../services/user-service';

function KitFilter() {
  const user = getLocalUser();
  const combinedKits = useSelector((state) => state.kits.combinedKits);
  const selectedKit = useSelector((state) => state.kits.selectedKit);

  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { kitId } = useParams();

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const params = {};
        if (filter) params.name = filter; // Set the name filter parameter if filter state is not empty
        if (sortBy) params.sortBy = sortBy; // Set the sortBy filter parameter if sortBy state is not empty
        if (order) params.order = order; // Set the order filter parameter if order state is not empty
        const kits = await getKits(params); // Fetch kits based on the filter parameters
        dispatch(setAllKits(kits)); // Update the Redux store with all kits

        if (kitId) {
          const { kit } = await getKitById(kitId); // Fetch the selected kit by ID
          dispatch(setSelectedKit(kit)); // Update the Redux store with the selected kit
        }
        if (user) {
          const userKits = await getUserKits(user._id); // Fetch the user-specific kits
          dispatch(setUserKits(userKits)); // Update the Redux store with the user-specific kits

          const filteredKits = kits.filter(
            (kit) => !kit.isCustom && !userKits.some((userKit) => userKit._id === kit._id)
          ); // Filter out custom kits and kits that are already owned by the user
          dispatch(setCombinedKits([...filteredKits, ...userKits])); // Update the Redux store with the combined kits
        } else {
          const filteredKits = kits.filter((kit) => !kit.isCustom); // Filter out custom kits
          dispatch(setCombinedKits(filteredKits)); // Update the Redux store with the combined kits
        }
      } catch (error) {
        dispatch(setError(error?.response?.data || 'Something went wrong!')); // Set the error message in the Redux store
        console.error('Failed to load kits', error);
      }
    };
    fetchKits(); // Fetch kits when the component mounts or when the filter, sortBy, or order states change
  }, [filter, sortBy, order, dispatch]);

  const handleChange = (e) => {
    const selectedKitId = e.target.value;
    if (selectedKitId) {
      const selectedKit = combinedKits.find((kit) => kit._id === selectedKitId);
      dispatch(setSelectedKit(selectedKit));
      navigateToSelectedKit(selectedKit);
    }
  };

  const navigateToSelectedKit = (selectedKit) => {
    const locationPath = location.pathname.split('/')[1];
    if (locationPath === 'drum') {
      navigate(`/drum/id/${selectedKit._id}`);
    } else if (locationPath === 'sequencer') {
      navigate(`/sequencer/id/${selectedKit._id}`);
    }
  };

  return (
    <article className="select-kit">
      <div>Select Kit:</div>
      <select
        className="filter-select"
        value={selectedKit ? selectedKit._id : ''}
        onChange={handleChange}
        placeholder="Select a kit"
      >
        <option value="" disabled>
          Select a kit
        </option>
        {combinedKits.map((kit) => (
          <option key={kit._id} value={kit._id}>
            {kit.name}
          </option>
        ))}
      </select>
    </article>
  );
}

export default KitFilter;
