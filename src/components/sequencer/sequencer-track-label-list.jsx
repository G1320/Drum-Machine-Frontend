import React from 'react';
import '../../assets/styles/components/sequencer/sequencer-track-label-list.scss';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { updateKitSounds } from '../../services/kit-service';

function SequencerTrackLabelList({ kitId, numOfSteps, selectedKitSounds }) {
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    // TODO: Fix drag end event, sounds always return to original position, sounds are fetched by updatedAt attribute
    const newKitSounds = Array.from(selectedKitSounds);
    const [reorderedSound] = newKitSounds.splice(result.source.index, 1);
    newKitSounds.splice(result.destination.index, 0, reorderedSound);

    try {
      const updatedSounds = await updateKitSounds(kitId, newKitSounds);
    } catch (error) {
      console.error(error);
    }
  };

  const isXl = () => numOfSteps === 32;
  const isXxl = () => numOfSteps === 64;

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
                  <article
                    className={`cell-title-container ${isXl() ? 'xl' : ''} ${isXxl() ? 'xxl' : ''}  `}
                  >
                    <li
                      className={`cell-title ${isXl() ? 'xl' : ''} ${isXxl() ? 'xxl' : ''}`}
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
