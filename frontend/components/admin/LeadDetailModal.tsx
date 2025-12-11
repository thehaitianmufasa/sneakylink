'use client';

/**
 * NeverMissLead - Lead Detail Modal Component
 *
 * Shows detailed information about a lead including call history and notes.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { X, Phone, Mail, Calendar, MapPin, MessageSquare, Play, Check } from 'lucide-react';
import type { Lead, CallLog } from '@shared/types/admin';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdated: () => void;
}

// ============================================================================
// Lead Detail Modal Component
// ============================================================================

export default function LeadDetailModal({
  lead,
  isOpen,
  onClose,
  onLeadUpdated,
}: LeadDetailModalProps) {
  const [currentStatus, setCurrentStatus] = useState<Lead['status']>('new');
  const [currentNotes, setCurrentNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Update state when lead changes
  useEffect(() => {
    if (lead) {
      setCurrentStatus(lead.status);
      setCurrentNotes(lead.notes || '');
    }
  }, [lead]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !lead) {
    return null;
  }

  // ============================================================================
  // Save Changes Handler
  // ============================================================================

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          leadId: lead.id,
          updates: {
            status: currentStatus,
            notes: currentNotes,
            last_contacted_at: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update lead');
      }

      alert('Lead updated successfully!');
      onLeadUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Failed to update lead. Please try again.');
    } finally {
      setSaving(false);
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
  // Format Duration (seconds to MM:SS)
  // ============================================================================

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================================================
  // Status Badge Colors
  // ============================================================================

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    converted: 'bg-purple-100 text-purple-800',
    lost: 'bg-red-100 text-red-800',
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {lead.full_name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Lead ID: {lead.id.substring(0, 8)}...
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Contact Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{lead.phone}</span>
                </div>
                {lead.email && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{lead.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>Created: {formatDate(lead.created_at)}</span>
                </div>
                {lead.last_contacted_at && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>
                      Last Contact: {formatDate(lead.last_contacted_at)}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Service Details */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Service Request
              </h3>
              <div className="space-y-2">
                {lead.service_type && (
                  <p>
                    <span className="font-medium">Service:</span>{' '}
                    {lead.service_type}
                  </p>
                )}
                {lead.urgency && (
                  <p>
                    <span className="font-medium">Urgency:</span>{' '}
                    <span className="capitalize">{lead.urgency}</span>
                  </p>
                )}
                {lead.preferred_contact_method && (
                  <p>
                    <span className="font-medium">Preferred Contact:</span>{' '}
                    <span className="capitalize">
                      {lead.preferred_contact_method}
                    </span>
                  </p>
                )}
                <p>
                  <span className="font-medium">Source:</span>{' '}
                  <span className="capitalize">{lead.source}</span>
                </p>
                {lead.message && (
                  <div className="mt-3">
                    <p className="font-medium mb-1">Message:</p>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      {lead.message}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Status Update */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Lead Status
              </h3>
              <select
                value={currentStatus}
                onChange={(e) =>
                  setCurrentStatus(e.target.value as Lead['status'])
                }
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </section>

            {/* Call History */}
            {lead.call_logs && lead.call_logs.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Call History
                </h3>
                <div className="space-y-3">
                  {lead.call_logs.map((call) => (
                    <div
                      key={call.id}
                      className="bg-gray-50 p-4 rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {formatDate(call.created_at)}
                        </span>
                        <span className="text-sm text-gray-600">
                          Duration: {formatDuration(call.duration)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {call.connected_to_owner && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            <Check className="w-3 h-3" />
                            Owner Answered
                          </span>
                        )}
                        {call.auto_sms_sent && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            <MessageSquare className="w-3 h-3" />
                            Auto SMS Sent
                          </span>
                        )}
                        {call.callback_completed && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            <Check className="w-3 h-3" />
                            Callback Complete
                          </span>
                        )}
                      </div>
                      {call.recording_url && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Play className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Voicemail Recording:
                            </span>
                          </div>
                          <audio
                            controls
                            className="w-full max-w-md"
                            preload="metadata"
                          >
                            <source src={call.recording_url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                          <a
                            href={call.recording_url}
                            download
                            className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 mt-1"
                          >
                            Download Recording
                          </a>
                        </div>
                      )}
                      {call.notes && (
                        <div className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Notes:</span> {call.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Notes */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Internal Notes
              </h3>
              <textarea
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                rows={6}
                placeholder="Add notes about this lead..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </section>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
