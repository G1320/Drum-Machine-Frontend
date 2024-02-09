import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getUserSongs, createSong, deleteSong } from '../../services/song-service';
import { setError } from '../../slices/errorSlice';
import { getLocalUser } from '../../services/user-service';
import { clearSequencerState, setSongId } from '../../slices/sequencerSlice';
import {
  clearLocalSequencerState,
  setLocalNumOfStepsPrePortrait,
  getLocalSequencerState,
  setLocalSequencerState,
  setLocalSongId,
} from '../../services/sequencer-service';
import { arraysEqual } from '../../utils/compareArrays';

const UserSongsList = () => {
  const [userSongs, setUserSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const tempo = useSelector((state) => state.sequencer.tempo);
  const pattern = useSelector((state) => state.sequencer.pattern);
  const songId = useSelector((state) => state.sequencer.songId);
  const numOfSteps = useSelector((state) => state.sequencer.numOfSteps);
  const volume = useSelector((state) => state.sequencer.volume);
  const delay = useSelector((state) => state.sequencer.delay);
  const reverb = useSelector((state) => state.sequencer.reverb);
  const swing = useSelector((state) => state.sequencer.swing);

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

    clearLocalSequencerState();
    dispatch(clearSequencerState());
    setLocalSequencerState(song);
    setLocalNumOfStepsPrePortrait(song.numOfSteps);
    setLocalSongId(song._id);
    navigate(`/sequencer/id/${song.kit}`);
    setIsLoading(false);
  };

  const handleSaveSong = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const sequencerState = getLocalSequencerState();

    try {
      const newSong = {
        name: `${userSongs.length + 1}`,
        userId: user._id,
        kitId,
        ...sequencerState,
      };
      const savedNewSong = await createSong(newSong);

      clearLocalSequencerState();
      dispatch(clearSequencerState());
      dispatch(setSongId(Math.random())); //Used to trigger a rerender of the sequencer

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

  const compareSongToState = (song) => {
    if (
      song._id !== songId ||
      !arraysEqual(song.pattern, pattern) ||
      song.numOfSteps !== numOfSteps ||
      song.tempo !== tempo ||
      song.volume !== volume ||
      song.delay !== delay ||
      song.reverb !== reverb ||
      song.swing !== swing
    )
      return false;
    else {
      return true;
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
                  <div className={`user-song`} key={index}>
                    <button
                      className={`user-song-select-btn ${compareSongToState(song) ? 'selected' : ''}`}
                      onClick={() => handleSongClick(song)}
                    >
                      S{index + 1}
                    </button>
                    <button
                      className={`user-song-delete-btn ${compareSongToState(song) ? 'selected' : ''}`}
                      onClick={() => handleDeleteSong(song._id)}
                    >
                      X
                    </button>
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
