import React, { useState, useEffect } from 'react';
import { getKit } from '../../services/kit-service';

const CurrKit = ({ kitId, user }) => {
  const [kit, setKit] = useState('');

  useEffect(() => {
    const fetchKit = async () => {
      const kit = await getKit(kitId);
      setKit(kit);
    };
    fetchKit();
  }, [kitId]);

  return (
    <div className="kit-name-external-wrapper">
      <span className="user-info-greeting">Hey {user.username}</span>

      <section className="kit-name-wrapper">
        <h2> {kit.name}</h2>
        <p>{kit.description}</p>
      </section>
    </div>
  );
};

export default CurrKit;
