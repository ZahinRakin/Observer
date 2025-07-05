import React, { useContext, useState } from 'react';
import DashboardSkeleton from '../components/DashboardSkeleton.jsx';
import { UserContext } from '../contexts/UserContext.jsx';
import ProfilePage from './ProfilePage.jsx';
import StoreOwnerSidebar from '../components/storeowner/StoreOwnerSidebar.jsx';
import StoreOwnerHeader from '../components/storeowner/StoreOwnerHeader.jsx';
import StoreOwnerFooter from '../components/storeowner/StoreOwnerFooter.jsx';
import StoreOwnerRenderDashboard from '../components/storeowner/StoreOwnerRenderDashboard.jsx';
import StoreOwnerRenderStores from '../components/storeowner/StoreOwnerRenderStores.jsx';

const StoreOwnerDashboard = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [editProfileMode, setEditProfileMode] = useState(false);

  let content;
  if (showProfilePage) {
    content = (
      <ProfilePage
        user={user}
        onBack={() => setShowProfilePage(false)}
        editMode={editProfileMode}
      />
    );
  } else if (activeTab === 'dashboard') content = <StoreOwnerRenderDashboard user={user} />;
  else if (activeTab === 'stores') content = <StoreOwnerRenderStores user={user} />;

  return (
    <DashboardSkeleton
      sidebar={<StoreOwnerSidebar activeTab={activeTab} onTabChange={setActiveTab} />}
      header={
        <StoreOwnerHeader
          user={user}
          onViewProfile={() => { setShowProfilePage(true); setEditProfileMode(false); }}
          onEditProfile={() => { setShowProfilePage(true); setEditProfileMode(true); }}
        />
      }
      footer={<StoreOwnerFooter />}
    >
      {content}
    </DashboardSkeleton>
  );
};

export default StoreOwnerDashboard;
