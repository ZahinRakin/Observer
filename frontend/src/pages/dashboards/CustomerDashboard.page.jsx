import React, { useContext, useState, useEffect } from 'react';
import DashboardSkeleton from '../../components/DashboardSkeleton.jsx';
import { UserContext } from '../../contexts/UserContext.jsx'; 
// import NewsCard from '../components/cards/NewsCard.jsx';
// import LoadingAnimation from '../components/Loading.jsx';
import ProfilePage from '../ProfilePage.jsx';
import CustomerSidebar from '../../components/customer/CustomerSidebar.jsx';
import CustomerHeader from '../../components/customer/CustomerHeader.jsx';
import CustomerFooter from '../../components/customer/CustomerFooter.jsx';
import RenderDashboard from '../../components/customer/CustomerRenderDashboard.jsx';
import RenderNews from '../../components/customer/CustomerRenderNews.jsx'; 
import RenderProducts from '../../components/customer/CustomerRenderProducts.jsx';


const CustomerDashboard = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [editProfileMode, setEditProfileMode] = useState(false);

  // Debug user context
  useEffect(() => {
    console.log('🔍 DEBUG - CustomerDashboard mounted');
    console.log('🔍 DEBUG - User from context:', user);
    console.log('🔍 DEBUG - User ID from context:', user?._id);
    console.log('🔍 DEBUG - Active tab:', activeTab);
  }, [user, activeTab]);

  console.log('🔍 DEBUG - CustomerDashboard rendering with user:', user);
  console.log('🔍 DEBUG - Active tab:', activeTab);

  let content;
  if (showProfilePage) {
    content = (
      <ProfilePage
        user={user}
        onBack={() => setShowProfilePage(false)}
        editMode={editProfileMode}
      />
    );
  } else if (activeTab === 'dashboard') {
    console.log('🔍 DEBUG - Rendering RenderDashboard with user:', user);
    content = <RenderDashboard user={user} />;
  } else if (activeTab === 'news') content = <RenderNews customerId={user.id}/>; //the customer id isn't getting to the RenderNews
  else if (activeTab === 'products') content = <RenderProducts />;

  return (
    <DashboardSkeleton
      sidebar={<CustomerSidebar activeTab={activeTab} onTabChange={setActiveTab} />}
      header={
        <CustomerHeader
          user={user}
          onViewProfile={() => { setShowProfilePage(true); setEditProfileMode(false); }}
          onEditProfile={() => { setShowProfilePage(true); setEditProfileMode(true); }}
        />
      }
      footer={<CustomerFooter />}
    >
      {content}
    </DashboardSkeleton>
  );
};

export default CustomerDashboard;
