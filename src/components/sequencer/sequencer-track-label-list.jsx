import React from 'react';
import '../../assets/styles/components/sequencer/sequencer-track-label-list.scss';
import { useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSounds } from '../../hooks/useSounds';

import { updateKitSounds } from '../../services/kit-service';

function SequencerTrackLabelList({ kitId }) {
  const { data: selectedKitSounds } = useSounds(kitId);
  const numOfSteps = useSelector((state) => state.sequencer.numOfSteps);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const newKitSounds = Array.from(selectedKitSounds);
    const [reorderedSound] = newKitSounds.splice(result.source.index, 1);
    newKitSounds.splice(result.destination.index, 0, reorderedSound);

    try {
      const updatedSounds = await updateKitSounds(kitId, newKitSounds);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="selectedKitSounds">
        {(provided) => (
          <ul
            key={'sounds'}
            className="cell-title-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {selectedKitSounds.map((sound, index) => (
              <Draggable key={sound._id} draggableId={sound._id} index={index}>
                {(provided) => (
                  <article className={`cell-title-container ${numOfSteps === 32 ? 'xl' : ''}`}>
                    <li
                      className={`cell-title ${numOfSteps === 32 ? 'xl' : ''}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      key={sound._id}
                    >
                      {sound.title}
                    </li>
                  </article>
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
