import React, { useState, useEffect } from 'react';
import { settingsService, handleAPIError } from '../../services/adminService.js';

const AdminRenderSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Observer Platform',
    siteDescription: 'A comprehensive store management and customer engagement platform',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    maxProductsPerStore: 1000,
    maxStoresPerOwner: 5,
    sessionTimeout: 30,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const settingsData = await settingsService.getSettings();
      setSettings(settingsData);
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
      console.error('Settings fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');
      
      const result = await settingsService.updateSettings(settings);
      setSuccessMessage('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
      console.log('Settings saved:', result);
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
      console.error('Settings save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = async () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      try {
        setSaving(true);
        setError(null);
        setSuccessMessage('');
        
        // Reset to default values
        const defaultSettings = {
          siteName: 'Observer Platform',
          siteDescription: 'A comprehensive store management and customer engagement platform',
          maintenanceMode: false,
          allowRegistration: true,
          emailNotifications: true,
          maxProductsPerStore: 1000,
          maxStoresPerOwner: 5,
          sessionTimeout: 30,
        };
        
        const result = await settingsService.updateSettings(defaultSettings);
        setSettings(defaultSettings);
        setSuccessMessage('Settings reset to defaults successfully!');
        
        setTimeout(() => setSuccessMessage(''), 3000);
        console.log('Settings reset:', result);
      } catch (err) {
        const errorInfo = handleAPIError(err);
        setError(errorInfo.message);
        console.error('Settings reset error:', err);
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700/50">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700/50">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">System Settings</h2>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-red-400 text-xl">⚠️</div>
              <div>
                <h3 className="text-red-300 font-semibold">Error</h3>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-green-400 text-xl">✅</div>
              <div>
                <h3 className="text-green-300 font-semibold">Success</h3>
                <p className="text-green-400 text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {/* General Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Site Description
                </label>
                <input
                  type="text"
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* System Controls */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">System Controls</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <div>
                  <label className="text-sm font-medium text-gray-200">Maintenance Mode</label>
                  <p className="text-xs text-gray-400">Temporarily disable the platform for maintenance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-gray-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <div>
                  <label className="text-sm font-medium text-gray-200">Allow User Registration</label>
                  <p className="text-xs text-gray-400">Allow new users to register accounts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowRegistration}
                    onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-gray-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <div>
                  <label className="text-sm font-medium text-gray-200">Email Notifications</label>
                  <p className="text-xs text-gray-400">Enable system-wide email notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-gray-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Limits */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">System Limits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Products Per Store
                </label>
                <input
                  type="number"
                  value={settings.maxProductsPerStore}
                  onChange={(e) => handleSettingChange('maxProductsPerStore', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Stores Per Owner
                </label>
                <input
                  type="number"
                  value={settings.maxStoresPerOwner}
                  onChange={(e) => handleSettingChange('maxStoresPerOwner', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-600/50">
            <button
              onClick={handleResetSettings}
              disabled={saving}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium disabled:opacity-50"
            >
              {saving ? 'Processing...' : 'Reset to Defaults'}
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRenderSettings; 