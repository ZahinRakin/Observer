import React from 'react';

function HomePage(){
  const response = await axios.get("http://127.0.0.1:8000/");

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
    </div>
  );
};


export default HomePage;