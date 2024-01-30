import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getUserSongs, createSong, deleteSong } from '../../services/song-service';
import { setError } from '../../slices/errorSlice';
import {
  setSelectedCells,
  setTempo,
  setVolume,
  setMutedTracks,
  setNumOfSteps,
  clearSequencerState,
} from '../../slices/sequencerSlice';
import { getLocalUser } from '../../services/user-service';
import {
  getLocalSelectedCells,
  localSaveSelectedCells,
  getLocalTempo,
  getLocalVolume,
  getLocalMutedTracks,
  localSaveTempo,
  localSaveVolume,
  localSaveMutedTracks,
  getLocalNumOfSteps,
  localSaveNumOfSteps,
  clearSequencerStorage,
} from '../../services/sequencer-service';

const UserSongsList = () => {
  const [userSongs, setUserSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { kitId } = useParams();
  const user = getLocalUser();

  const loadSongs = async () => {
    try {
      const songs = await getUserSongs(user._id);
      setUserSongs(songs);
    } catch (error) {
      dispatch(setError(error?.response?.data || 'Failed to load songs'));
      console.error('Error fetching songs:', error);
    }
  };

  useEffect(() => {
    if (user) loadSongs();
  }, [user?._id]);

  const handleSongClick = (song) => {
    if (isLoading) return;
    setIsLoading(true);

    const { tempo, volume, mutedTracks, pattern, numOfSteps, kit } = song;

    if (tempo) {
      dispatch(setTempo(tempo));
      localSaveTempo(tempo);
    }
    if (volume) {
      dispatch(setVolume(volume));
      localSaveVolume(volume);
    }
    if (mutedTracks) {
      dispatch(setMutedTracks(mutedTracks));
      localSaveMutedTracks(mutedTracks);
    }
    if (pattern) {
      dispatch(setSelectedCells(pattern));
      localSaveSelectedCells(pattern);
    }
    if (numOfSteps) {
      localSaveNumOfSteps(numOfSteps);
      dispatch(setNumOfSteps(numOfSteps));
    }

    navigate(`/sequencer/id/${kit}`);
    setIsLoading(false);
  };

  const handleSaveSong = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const selectedCells = getLocalSelectedCells();
    const mutedTracks = getLocalMutedTracks();
    const tempo = getLocalTempo();
    const volume = getLocalVolume();
    const numOfSteps = getLocalNumOfSteps();

    try {
      const newSong = {
        name: `${userSongs.length + 1}`,
        pattern: selectedCells,
        kitId,
        tempo,
        volume,
        numOfSteps,
        mutedTracks,
        userId: user._id,
      };
      const savedNewSong = await createSong(newSong);

      clearSequencerStorage();
      dispatch(clearSequencerState());

      setUserSongs([...userSongs, savedNewSong]);
    } catch (error) {
      dispatch(setError(error?.response?.data || 'Failed to save song'));
      console.error('Error saving song:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSong = async (songId) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await deleteSong(user._id, songId);
      loadSongs();
    } catch (error) {
      dispatch(setError(error?.response?.data || 'Failed to delete song'));
      console.error('Error deleting song:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {user && (
        <section className="song-options-menu">
          <button className="save-song-btn" onClick={handleSaveSong} disabled={isLoading}>
            {isLoading ? <CircularProgress size={16} style={{ color: 'white' }} /> : 'SAVE'}
          </button>
          <div className="user-songs-list">
            {userSongs.length > 0
              ? userSongs.map((song, index) => (
                  <div className="user-song" key={index}>
                    <button onClick={() => handleSongClick(song)}>S{index + 1}</button>
                    <button onClick={() => handleDeleteSong(song._id)}>X</button>
                  </div>
                ))
              : null}
          </div>
        </section>
      )}
    </>
  );
};

export default UserSongsList;
