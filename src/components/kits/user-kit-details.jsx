import React from 'react';
import '../../assets/styles/components/kits/user-kit-details.scss';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function UserKitDetails({ userKit, onRemoveKit, onSelectKit }) {
  return (
    <article onClick={onSelectKit} className="user-kit-details">
      <span className="user-kit-title">{userKit.name}</span>
      <button className="remove-kit-button" onClick={onRemoveKit}>
        <FontAwesomeIcon className="remove-icon" icon={faXmark} size="2xs" />
      </button>
    </article>
  );
}

export default UserKitDetails;
