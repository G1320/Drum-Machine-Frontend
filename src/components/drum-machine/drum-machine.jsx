import React, { useState, useEffect, useRef, createRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '../../assets/styles/components/drum-machine/drum-machine.css';
import { Button } from '@mui/material';
import { getLocalUser } from '../../services/user-service';
import { deleteKit, getKitSounds } from '../../services/kit-service';
import { addKitToUser, getUserKits } from '../../services/user-service';

import { setError } from '../../slices/errorSlice';
import { setSuccess } from '../../slices/successSlice';
import drumMachineDefaultConfig from '../../config/drumMachineDefaultConfig';
import Pad from './drum-pad';
import SoundsList from '../sounds/sounds-list';
import CurrKit from '../kits/curr-kit';
import UserInfo from '../user/user-info';

const DrumMachine = () => {
  const { kitId } = useParams();
  const [activePad, setActivePad] = useState(null);
  const [sounds, setSounds] = useState([]);

  const audioRefs = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = getLocalUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (kitId) {
          const kitSounds = await getKitSounds(kitId);
          setSounds(kitSounds);
          audioRefs.current = kitSounds.map((_, index) => audioRefs.current[index] ?? createRef());
        }
      } catch (error) {
        console.error('Failed to load kit', error);
        dispatch(setError(error?.response?.data || 'Failed to load kit'));
      }
    };

    fetchData();
  }, [kitId, sounds]);

  const handleDeleteKit = async () => {
    try {
      await deleteKit(kitId);
      dispatch(setSuccess('Kit deleted successfully!'));
      navigate('/pages/id/64e61e8b7aecdc67f863233c');
    } catch (error) {
      console.error('Failed to delete kit', error);
      dispatch(setError(error?.response?.data || 'Failed to delete data'));
    }
  };

  const handleAddToKits = async () => {
    if (user) {
      try {
        await addKitToUser(user._id, kitId);
        const userKits = await getUserKits(user._id);
        dispatch({ type: 'userKits/setUserKits', payload: userKits });
        dispatch(setSuccess('Kit added to your kits!'));
      } catch (error) {
        console.error('Failed to add kit to user', error);
        dispatch(setError(error?.response?.data || 'Failed to add kit to user'));
      }
    } else {
      dispatch(setError('Please log in to add a Kit to your Kits!'));
    }
  };

  const toggleActive = (keyCode) => {
    if (activePad === keyCode) {
      setActivePad(null);
    } else {
      setActivePad(keyCode);
      setTimeout(() => setActivePad(null), 70);
    }
  };

  const handleNavigateToEdit = () => {
    navigate(`/pages/id/${kitId}`);
  };

  return (
    <section className="drum-machine">
      <CurrKit kitId={kitId} user={user} />
      <div className="drum-machine-wrapper">
        <UserInfo />
        <article className="drum-table">
          {sounds.map((sound, index) => (
            <Pad
              key={sound._id}
              keyCode={drumMachineDefaultConfig[index].keyCode.toString()}
              sound={sound}
              isActive={activePad === drumMachineDefaultConfig[index].keyCode.toString()}
              toggleActive={toggleActive}
              audioRef={audioRefs.current[index]}
            />
          ))}
        </article>
      </div>
      <div className="drum-machine-btns-wrapper">
        <div className="drum-machine-btns-internal-wrapper">
          <Button className="edit-btn" variant="contained" onClick={handleNavigateToEdit}>
            Edit kit
          </Button>
          <Button
            className="add-to-kits-btn"
            variant="contained"
            color="secondary"
            onClick={handleAddToKits}
          >
            Add to my kits
          </Button>
          <Button className="delete-btn" variant="contained" color="error" onClick={handleDeleteKit}>
            Delete
          </Button>
        </div>
      </div>
      <section className="drum-machine-bottom-wrapper">
        <SoundsList kitId={kitId} />
      </section>
    </section>
  );
};

export default DrumMachine;
