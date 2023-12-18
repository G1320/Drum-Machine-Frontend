import React from 'react';
import '../../assets/styles/components/sequencer/sequencer-track-label-list.scss';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedKitSounds } from '../../slices/soundsSlice';

import { updateKitSounds } from '../../services/kit-service';

function SequencerTrackLabelList({ kitId }) {
  const kitSounds = useSelector((state) => state.sounds.selectedKitSounds);
  const dispatch = useDispatch();

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const newKitSounds = Array.from(kitSounds);
    const [reorderedSound] = newKitSounds.splice(result.source.index, 1);
    newKitSounds.splice(result.destination.index, 0, reorderedSound);

    try {
      const updatedSounds = await updateKitSounds(kitId, newKitSounds);
      console.log('updatedSounds: ', updatedSounds);
      dispatch(setSelectedKitSounds(updatedSounds));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="kitSounds">
        {(provided) => (
          <ul
            key={'sounds'}
            className="cell-title-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {kitSounds.map((sound, index) => (
              <Draggable key={sound._id} draggableId={sound._id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    key={sound._id}
                  >
                    {sound.title}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default SequencerTrackLabelList;
