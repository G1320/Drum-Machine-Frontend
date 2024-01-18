import React, { forwardRef } from 'react';
import '../../assets/styles/components/kits/user-kit-details.scss';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserKitDetails = forwardRef(({ userKit, onRemoveKit, onSelectKit, selectedKit }, ref) => {
  const isSelected = selectedKit && selectedKit._id === userKit._id;

  const handleRemoveKit = (e) => {
    e.stopPropagation();
    onRemoveKit(userKit._id);
  };

  return (
    <article
      ref={ref}
      onClick={onSelectKit}
      className={`user-kit-details ${isSelected ? 'selected' : ''}`}
    >
      <span className="user-kit-title">{userKit.name}</span>

      {userKit.isCustom && (
        <button className="remove-kit-button" onClick={handleRemoveKit}>
          <FontAwesomeIcon className="remove-icon" icon={faXmark} size="2xs" />
        </button>
      )}
    </article>
  );
});

export default UserKitDetails;
