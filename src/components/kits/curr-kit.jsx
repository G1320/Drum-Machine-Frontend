import React, { useState, useEffect } from 'react';
import '../../assets/styles/components/kits/curr-kit.scss';
import { getKitById } from '../../services/kit-service';

const CurrKit = ({ kitId, user }) => {
  const [kit, setKit] = useState('');

  useEffect(() => {
    const fetchKit = async () => {
      const { kit } = await getKitById(kitId);
      setKit(kit);
    };
    fetchKit();
  }, [kitId]);

  if (user) {
    return (
      <div className="kit-name-external-wrapper">
        <span className="user-info-greeting">Hey {user.username}</span>

        <section className="kit-name-internal-wrapper">
          <h2> {kit.name}</h2>
          <p>{kit.description}</p>
        </section>
      </div>
    );
  }
};

export default CurrKit;
