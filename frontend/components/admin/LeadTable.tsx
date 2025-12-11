'use client';

/**
 * NeverMissLead - Lead Table Component
 *
 * Displays leads in a sortable, filterable table for the CRM dashboard.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Phone, Search, Filter } from 'lucide-react';
import type { Lead } from '@shared/types/admin';

// ============================================================================
// Status Badge Component
// ============================================================================

const StatusBadge = ({ status }: { status: Lead['status'] }) => {
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    converted: 'bg-purple-100 text-purple-800',
    lost: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    converted: 'Converted',
    lost: 'Lost',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
};

// ============================================================================
// Lead Table Component
// ============================================================================

interface LeadTableProps {
  onLeadClick: (lead: Lead) => void;
}

export default function LeadTable({ onLeadClick }: LeadTableProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [callingLeadId, setCallingLeadId] = useState<string | null>(null);

  // ============================================================================
  // Fetch Leads
  // ============================================================================

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      params.append('limit', '50');

      const response = await fetch(`/api/admin/leads?${params.toString()}`, {
        credentials: 'include', // Include cookies
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }

      const data = await response.json();
      setLeads(data.leads || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  // Fetch leads on mount and when filters change
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ============================================================================
  // Click-to-Call Handler
  // ============================================================================

  const handleClickToCall = async (lead: Lead, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click

    if (callingLeadId) {
      alert('A call is already in progress. Please wait.');
      return;
    }

    if (!confirm(`Call ${lead.full_name} at ${lead.phone}?`)) {
      return;
    }

    setCallingLeadId(lead.id);

    try {
      const response = await fetch('/api/admin/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          leadId: lead.id,
          leadPhone: lead.phone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }

      alert(`Calling ${lead.full_name}... Your phone will ring shortly.`);

      // Refresh leads to update last_contacted_at
      await fetchLeads();
    } catch (err) {
      console.error('Error initiating call:', err);
      alert('Failed to initiate call. Please try again.');
    } finally {
      setCallingLeadId(null);
    }
  };

  // ============================================================================
  // Format Date
  // ============================================================================

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-2 text-gray-600">Loading leads...</p>
        </div>
      )}

      {/* Leads Table */}
      {!loading && leads.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => onLeadClick(lead)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {lead.email || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {lead.service_type || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {lead.source}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(lead.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => handleClickToCall(lead, e)}
                        disabled={callingLeadId === lead.id}
                        className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        {callingLeadId === lead.id ? 'Calling...' : 'Call'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && leads.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No leads found</p>
          <p className="text-gray-400 mt-2">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Leads will appear here when customers submit forms or call'}
          </p>
        </div>
      )}
    </div>
  );
}
