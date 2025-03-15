import React from 'react';
import { useEffect, useState } from 'react';
import { getData as getHomePageData } from "../utils/fetchData.js";

function HomePage(){
  const [homePageData, setHomePageData] = useState("guest");

  useEffect(()=>{
    getHomePageData('/api/v1/healthcheck', setHomePageData);
  }, [])

  return (
    <div>
      <h1>welcome {homePageData.data} {homePageData.age}</h1>
    </div>
  );
};


export default HomePage;