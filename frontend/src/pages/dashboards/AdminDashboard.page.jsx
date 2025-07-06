import React, { useContext, useState } from 'react';
import DashboardSkeleton from '../../components/DashboardSkeleton';
import { UserContext } from '../../contexts/UserContext';
import ProfilePage from '../ProfilePage';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminFooter from '../../components/admin/AdminFooter';
import AdminRenderDashboard from '../../components/admin/AdminRenderDashboard';
import AdminRenderUsers from '../../components/admin/AdminRenderUsers';
// import AdminRenderSettings from '../../components/admin/AdminRenderSettings';
import AdminTestConnection from '../../components/admin/AdminTestConnection';

const AdminDashboard = () => {
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
  } else if (activeTab === 'dashboard') content = <AdminRenderDashboard user={user} />;
  else if (activeTab === 'users') content = <AdminRenderUsers />;
  else if (activeTab === 'settings') content = <AdminRenderSettings />;
  else if (activeTab === 'test') content = <AdminTestConnection />; //the sidebar doesn't have this tab.

  return (
    <DashboardSkeleton
      sidebar={<AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />}
      header={
        <AdminHeader
          user={user}
          onViewProfile={() => { setShowProfilePage(true); setEditProfileMode(false); }}
          onEditProfile={() => { setShowProfilePage(true); setEditProfileMode(true); }}
        />
      }
      footer={<AdminFooter />}
      >
      {content}
    </DashboardSkeleton>
  );
};

export default AdminDashboard;
