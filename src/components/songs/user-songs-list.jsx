import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getUserSongs, createSong, deleteSong } from '../../services/song-service';
import { setError } from '../../slices/errorSlice';
import { getLocalUser } from '../../services/user-service';
import * as sequencerSlice from '../../slices/sequencerSlice';
import * as sequencerService from '../../services/sequencer-service';

import { arraysEqual } from '../../utils/compareArrays';

const UserSongsList = ({ sequencerState }) => {
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

    sequencerService.clearLocalSequencerState();
    dispatch(sequencerSlice.clearSequencerState());
    sequencerService.setLocalSequencerState(song);
    sequencerService.setLocalNumOfStepsPrePortrait(song.numOfSteps);
    sequencerService.setLocalSongId(song._id);

    navigate(`/sequencer/id/${song.kit}`);
    setIsLoading(false);
  };

  const handleSaveSong = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const sequencerState = sequencerService.getLocalSequencerState();

    try {
      const newSong = {
        name: `${userSongs.length + 1}`,
        userId: user._id,
        kitId,
        ...sequencerState,
      };
      const savedNewSong = await createSong(newSong);

      setUserSongs([...userSongs, savedNewSong]);
      sequencerService.clearLocalSequencerState();
      dispatch(sequencerSlice.clearSequencerState());
      dispatch(sequencerSlice.setSongId(Math.random())); //Used to trigger a rerender of the sequencer
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
  // Compares the song to the current sequencerState and returns a boolean
  const compareSongToState = (song) =>
    song._id === sequencerState.songId &&
    arraysEqual(song.pattern, sequencerState.pattern) &&
    arraysEqual(song.mutedTracks, sequencerState.mutedTracks) &&
    song.numOfSteps === sequencerState.numOfSteps &&
    song.tempo === sequencerState.tempo &&
    song.volume === sequencerState.volume &&
    song.delay === sequencerState.delay &&
    song.reverb === sequencerState.reverb &&
    song.swing === sequencerState.swing;

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
