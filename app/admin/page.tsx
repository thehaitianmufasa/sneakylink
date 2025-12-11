'use client';

/**
 * NeverMissLead - Admin Dashboard Page
 *
 * Main CRM dashboard for managing leads and calls.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Users, Phone, CheckCircle, TrendingUp } from 'lucide-react';
import LeadTable from '@frontend/components/admin/LeadTable';
import LeadDetailModal from '@frontend/components/admin/LeadDetailModal';
import type { Lead } from '@shared/types/admin';

// ============================================================================
// Types
// ============================================================================

interface ClientInfo {
  id: string;
  slug: string;
  business_name: string;
}

// ============================================================================
// Admin Dashboard Page
// ============================================================================

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableKey, setTableKey] = useState(0); // Force table refresh
  const [stats, setStats] = useState({
    total: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
  });

  // ============================================================================
  // Check Authentication
  // ============================================================================

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth', {
          credentials: 'include',
        });

        if (!response.ok) {
          router.push('/admin/login');
          return;
        }

        const data = await response.json();
        if (data.authenticated) {
          setAuthenticated(true);
          setClient(data.client);
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // ============================================================================
  // Logout Handler
  // ============================================================================

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to log out?')) {
      return;
    }

    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
        credentials: 'include',
      });

      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
      alert('Failed to log out. Please try again.');
    }
  };

  // ============================================================================
  // Lead Click Handler
  // ============================================================================

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  // ============================================================================
  // Fetch Stats
  // ============================================================================

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/leads?limit=1000', {
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Failed to fetch leads for stats');
        return;
      }

      const data = await response.json();
      const leads: Lead[] = data.leads || [];

      // Calculate stats
      const newStats = {
        total: leads.length,
        contacted: leads.filter((l) => l.status === 'contacted').length,
        qualified: leads.filter((l) => l.status === 'qualified').length,
        converted: leads.filter((l) => l.status === 'converted').length,
      };

      setStats(newStats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch stats on mount and when authenticated
  useEffect(() => {
    if (authenticated) {
      fetchStats();
    }
  }, [authenticated, tableKey]);

  // ============================================================================
  // Lead Updated Handler
  // ============================================================================

  const handleLeadUpdated = () => {
    // Force table to refresh by changing key
    setTableKey((prev) => prev + 1);
    // Stats will auto-refresh via useEffect dependency on tableKey
  };

  // ============================================================================
  // Loading State
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || !client) {
    return null;
  }

  // ============================================================================
  // Render Dashboard
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {client.business_name}
              </h1>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Leads</h2>
          <p className="text-gray-600 mt-1">
            Manage and track your customer leads
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Phone className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Contacted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.contacted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Qualified</p>
                <p className="text-2xl font-bold text-gray-900">{stats.qualified}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Converted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.converted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <LeadTable key={tableKey} onLeadClick={handleLeadClick} />

        {/* Lead Detail Modal */}
        <LeadDetailModal
          lead={selectedLead}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLeadUpdated={handleLeadUpdated}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} NeverMissLead. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
