import React, { useContext, useState } from 'react';
import DashboardSkeleton from '../components/DashboardSkeleton.jsx';
import { UserContext } from '../contexts/UserContext.jsx'; 
// import NewsCard from '../components/cards/NewsCard.jsx';
// import LoadingAnimation from '../components/Loading.jsx';
import CustomerSidebar from '../components/customer/CustomerSidebar.jsx';
import CustomerHeader from '../components/customer/CustomerHeader.jsx';
import CustomerFooter from '../components/customer/CustomerFooter.jsx';
import RenderDashboard from '../components/customer/CustomerRenderDashboard.jsx';
import RenderNews from '../components/customer/CustomerRenderNews.jsx';
import RenderProducts from '../components/customer/CustomerRenderProducts.jsx';


const CustomerDashboard = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  let content;
  if (activeTab === 'dashboard') content = <RenderDashboard user={user} />;
  else if (activeTab === 'news') content = <RenderNews />;
  else if (activeTab === 'products') content = <RenderProducts />;

  return (
    <DashboardSkeleton
      sidebar={<CustomerSidebar activeTab={activeTab} onTabChange={setActiveTab} />}
      header={<CustomerHeader user={user} />}
      footer={<CustomerFooter />}
    >
      {content}
    </DashboardSkeleton>
  );
};

export default CustomerDashboard;
