import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { SystemSettings } from '../../types';
import api from '../../utils/api';
import { toast } from 'sonner';

/*
 * SystemSettingsPage — GET/PUT /api/settings/system
 *
 * Backend SystemSettings model fields (snake_case from DB, camelCase in API):
 *   maintenanceMode, allowRegistration, reviewAutoApprove,
 *   paymentGateway, emailNotifications, maxFileSize,
 *   currency, currencySymbol, supportEmail
 *
 * GET  fetches the current settings row.
 * PUT  overwrites all settings fields.
 * The backend endpoint is admin-only (JwtAuthGuard + RoleGuard('ADMIN')).
 */

const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    id: 0,
    maintenanceMode: false,
    allowRegistration: true,
    reviewAutoApprove: false,
    paymentGateway: 'fapshi',
    emailNotifications: true,
    maxFileSize: 5,
    currency: 'XAF',
    currencySymbol: 'FCFA',
    supportEmail: '',
    createdAt: '',
    updatedAt: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* GET /api/settings/system */
  useEffect(() => {
    api.get<SystemSettings>('/settings/system')
      .then(({ data }) => setSettings(data))
      .catch(() => toast.error('Failed to load system settings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (field: keyof SystemSettings) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: keyof SystemSettings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  /* PUT /api/settings/system */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put<SystemSettings>('/settings/system', settings);
      setSettings(data);
      toast.success('Settings saved successfully.');
    } catch { toast.error('Failed to save settings.'); }
    finally { setSaving(false); }
  };

  if (loading) {
    return <div><h1 className="text-3xl font-poppins font-bold text-gray-800 mb-8">System Settings</h1><p className="text-gray-500">Loading settings...</p></div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-poppins font-bold text-gray-800 mb-8">System Settings</h1>

      <Card className="p-6 md:p-8 shadow-xl mb-8">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4">General</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Support Email</label>
              <input type="email" value={settings.supportEmail || ''} onChange={(e) => handleChange('supportEmail', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Currency Symbol</label>
              <input type="text" value={settings.currencySymbol} onChange={(e) => handleChange('currencySymbol', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
          </div>

          <hr className="my-6" />

          <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4">Feature Toggles</h2>
          <div className="space-y-4">
            {[
              { key: 'maintenanceMode' as const, label: 'Maintenance Mode' },
              { key: 'allowRegistration' as const, label: 'Allow New Registrations' },
              { key: 'reviewAutoApprove' as const, label: 'Auto-Approve Reviews' },
              { key: 'emailNotifications' as const, label: 'Email Notifications' },
            ].map(({ key, label }) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm text-gray-900">{label}</span>
                <input type="checkbox" checked={!!settings[key]} onChange={() => handleToggle(key)} className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
              </div>
            ))}
          </div>

          <hr className="my-6" />

          <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4">Payment & Limits</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Payment Gateway</label>
              <input type="text" value={settings.paymentGateway} onChange={(e) => handleChange('paymentGateway', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Max File Upload Size (MB)</label>
              <input type="number" value={settings.maxFileSize} onChange={(e) => handleChange('maxFileSize', Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button type="submit" variant="primary" size="lg" isLoading={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SystemSettingsPage;
