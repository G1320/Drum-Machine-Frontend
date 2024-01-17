import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getUserSongs, createSong, deleteSong } from '../../services/song-service';
import { setError } from '../../slices/errorSlice';
import { setSelectedCells, clearSelectedCells } from '../../slices/selectedCellsSlice';
import { getLocalUser } from '../../services/user-service';
import { getLocalSelectedCells, localSaveSelectedCells } from '../../services/sequencer-service';

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
    setIsLoading(true);
    dispatch(clearSelectedCells());
    localSaveSelectedCells([]);

    setTimeout(() => {
      dispatch(setSelectedCells(song.pattern));
      localSaveSelectedCells(song.pattern);
      navigate(`/sequencer/id/${song.kit}`);
      setIsLoading(false);
    }, 500);
  };

  const handleSaveSong = async () => {
    const selectedCells = getLocalSelectedCells();
    setIsLoading(true);
    try {
      const newSong = {
        name: `${userSongs.length + 1}`,
        pattern: selectedCells,
        kitId,
        userId: user._id,
      };

      const savedSong = await createSong(newSong);

      dispatch(clearSelectedCells());
      localSaveSelectedCells([]);
      setUserSongs([...userSongs, savedSong]);
    } catch (error) {
      dispatch(setError(error?.response?.data || 'Failed to save song'));
      console.error('Error saving song:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      setIsLoading(true);
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
                    <button onClick={() => handleSongClick(song)}>S{song.name}</button>
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
