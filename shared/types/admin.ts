/**
 * Shared types for Admin CRM Dashboard
 */

export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  service_type: string | null;
  message: string | null;
  urgency: string | null;
  preferred_contact_method: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: 'website' | 'phone' | 'sms' | 'referral';
  page_url: string | null;
  created_at: string;
  last_contacted_at: string | null;
  notes: string | null;
  call_logs?: CallLog[];
}

export interface CallLog {
  id: string;
  from_number: string;
  to_number: string;
  status: string | null;
  duration: number;
  recording_url: string | null;
  connected_to_owner: boolean;
  auto_sms_sent: boolean;
  notes: string | null;
  callback_completed: boolean;
  callback_at: string | null;
  created_at: string;
}
