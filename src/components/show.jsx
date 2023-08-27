import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPageData } from '../services/data-service';

function Show() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  const { pageName } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await getPageData(pageName);
        setData(pageData);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    };

    fetchData();
  }, [pageName]);

  if (error) {
    return <div>Error loading page. Please try again later.</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{data.name}</h1>
      <h1>{data.description}</h1>
      <h1>{data.subscribers}</h1>
    </div>
  );
}

export default Show;
