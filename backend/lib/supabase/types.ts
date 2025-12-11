/**
 * NeverMissLead - Supabase Database Types
 *
 * Auto-generated TypeScript types for database schema.
 * These types should be regenerated whenever the schema changes.
 *
 * To regenerate:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          slug: string
          business_name: string
          legal_name: string
          industry: string
          phone: string
          email: string
          address: string | null
          status: 'active' | 'inactive' | 'suspended' | 'trial'
          subscription_plan: 'standard' | 'premium' | 'enterprise'
          subscription_status: 'active' | 'past_due' | 'canceled' | 'trialing'
          trial_ends_at: string | null
          subscription_started_at: string
          monthly_price: number
          setup_fee: number
          setup_fee_paid: boolean
          custom_domain: string | null
          vercel_project_id: string | null
          deployment_url: string | null
          twilio_phone_number: string | null
          twilio_forward_to: string | null
          notification_phone: string | null
          notification_email: string | null
          created_at: string
          updated_at: string
          last_activity_at: string
        }
        Insert: {
          id?: string
          slug: string
          business_name: string
          legal_name: string
          industry: string
          phone: string
          email: string
          address?: string | null
          status?: 'active' | 'inactive' | 'suspended' | 'trial'
          subscription_plan?: 'standard' | 'premium' | 'enterprise'
          subscription_status?: 'active' | 'past_due' | 'canceled' | 'trialing'
          trial_ends_at?: string | null
          subscription_started_at?: string
          monthly_price?: number
          setup_fee?: number
          setup_fee_paid?: boolean
          custom_domain?: string | null
          vercel_project_id?: string | null
          deployment_url?: string | null
          twilio_phone_number?: string | null
          twilio_forward_to?: string | null
          created_at?: string
          updated_at?: string
          last_activity_at?: string
        }
        Update: {
          id?: string
          slug?: string
          business_name?: string
          legal_name?: string
          industry?: string
          phone?: string
          email?: string
          address?: string | null
          status?: 'active' | 'inactive' | 'suspended' | 'trial'
          subscription_plan?: 'standard' | 'premium' | 'enterprise'
          subscription_status?: 'active' | 'past_due' | 'canceled' | 'trialing'
          trial_ends_at?: string | null
          subscription_started_at?: string
          monthly_price?: number
          setup_fee?: number
          setup_fee_paid?: boolean
          custom_domain?: string | null
          vercel_project_id?: string | null
          deployment_url?: string | null
          twilio_phone_number?: string | null
          twilio_forward_to?: string | null
          notification_phone?: string | null
          notification_email?: string | null
          created_at?: string
          updated_at?: string
          last_activity_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          client_id: string
          full_name: string
          phone: string
          email: string | null
          service_type: string | null
          message: string | null
          urgency: 'emergency' | 'same-day' | 'scheduled' | 'consultation' | null
          preferred_contact_method: 'phone' | 'email' | 'sms' | null
          source: 'website' | 'phone' | 'sms' | 'referral'
          page_url: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          referrer: string | null
          status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          assigned_to: string | null
          contacted_at: string | null
          converted_at: string | null
          notes: string | null
          last_contacted_at: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          full_name: string
          phone: string
          email?: string | null
          service_type?: string | null
          message?: string | null
          urgency?: 'emergency' | 'same-day' | 'scheduled' | 'consultation' | null
          preferred_contact_method?: 'phone' | 'email' | 'sms' | null
          source?: 'website' | 'phone' | 'sms' | 'referral'
          page_url?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          referrer?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          assigned_to?: string | null
          contacted_at?: string | null
          converted_at?: string | null
          notes?: string | null
          last_contacted_at?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          full_name?: string
          phone?: string
          email?: string | null
          service_type?: string | null
          message?: string | null
          urgency?: 'emergency' | 'same-day' | 'scheduled' | 'consultation' | null
          preferred_contact_method?: 'phone' | 'email' | 'sms' | null
          source?: 'website' | 'phone' | 'sms' | 'referral'
          page_url?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          referrer?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          assigned_to?: string | null
          contacted_at?: string | null
          converted_at?: string | null
          notes?: string | null
          last_contacted_at?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      call_logs: {
        Row: {
          id: string
          client_id: string
          lead_id: string | null
          twilio_call_sid: string
          twilio_account_sid: string
          from_number: string
          to_number: string
          forwarded_to: string | null
          status: 'ringing' | 'in-progress' | 'completed' | 'busy' | 'no-answer' | 'failed' | 'canceled' | null
          direction: 'inbound' | 'outbound' | null
          duration: number
          started_at: string | null
          answered_at: string | null
          ended_at: string | null
          recording_url: string | null
          recording_duration: number | null
          caller_city: string | null
          caller_state: string | null
          caller_zip: string | null
          caller_country: string | null
          dial_status: 'completed' | 'no-answer' | 'busy' | 'failed' | 'canceled' | null
          connected_to_owner: boolean
          owner_answered_at: string | null
          auto_sms_sent: boolean
          notes: string | null
          callback_completed: boolean
          callback_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          lead_id?: string | null
          twilio_call_sid: string
          twilio_account_sid: string
          from_number: string
          to_number: string
          forwarded_to?: string | null
          status?: 'ringing' | 'in-progress' | 'completed' | 'busy' | 'no-answer' | 'failed' | 'canceled' | null
          direction?: 'inbound' | 'outbound' | null
          duration?: number
          started_at?: string | null
          answered_at?: string | null
          ended_at?: string | null
          recording_url?: string | null
          recording_duration?: number | null
          caller_city?: string | null
          caller_state?: string | null
          caller_zip?: string | null
          caller_country?: string | null
          dial_status?: 'completed' | 'no-answer' | 'busy' | 'failed' | 'canceled' | null
          connected_to_owner?: boolean
          owner_answered_at?: string | null
          auto_sms_sent?: boolean
          notes?: string | null
          callback_completed?: boolean
          callback_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          lead_id?: string | null
          twilio_call_sid?: string
          twilio_account_sid?: string
          from_number?: string
          to_number?: string
          forwarded_to?: string | null
          status?: 'ringing' | 'in-progress' | 'completed' | 'busy' | 'no-answer' | 'failed' | 'canceled' | null
          direction?: 'inbound' | 'outbound' | null
          duration?: number
          started_at?: string | null
          answered_at?: string | null
          ended_at?: string | null
          recording_url?: string | null
          recording_duration?: number | null
          caller_city?: string | null
          caller_state?: string | null
          caller_zip?: string | null
          caller_country?: string | null
          dial_status?: 'completed' | 'no-answer' | 'busy' | 'failed' | 'canceled' | null
          connected_to_owner?: boolean
          owner_answered_at?: string | null
          auto_sms_sent?: boolean
          notes?: string | null
          callback_completed?: boolean
          callback_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          id: string
          session_token: string
          client_id: string
          created_at: string
          expires_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          session_token: string
          client_id: string
          created_at?: string
          expires_at: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          session_token?: string
          client_id?: string
          created_at?: string
          expires_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      sms_logs: {
        Row: {
          id: string
          client_id: string
          lead_id: string | null
          twilio_message_sid: string
          twilio_account_sid: string
          from_number: string
          to_number: string
          body: string
          status: 'queued' | 'sending' | 'sent' | 'delivered' | 'undelivered' | 'failed' | 'received' | null
          direction: 'inbound' | 'outbound' | null
          is_auto_response: boolean
          triggered_by_message_sid: string | null
          error_code: string | null
          error_message: string | null
          price: number | null
          price_unit: string | null
          sent_at: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          lead_id?: string | null
          twilio_message_sid: string
          twilio_account_sid: string
          from_number: string
          to_number: string
          body: string
          status?: 'queued' | 'sending' | 'sent' | 'delivered' | 'undelivered' | 'failed' | 'received' | null
          direction?: 'inbound' | 'outbound' | null
          is_auto_response?: boolean
          triggered_by_message_sid?: string | null
          error_code?: string | null
          error_message?: string | null
          price?: number | null
          price_unit?: string | null
          sent_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          lead_id?: string | null
          twilio_message_sid?: string
          twilio_account_sid?: string
          from_number?: string
          to_number?: string
          body?: string
          status?: 'queued' | 'sending' | 'sent' | 'delivered' | 'undelivered' | 'failed' | 'received' | null
          direction?: 'inbound' | 'outbound' | null
          is_auto_response?: boolean
          triggered_by_message_sid?: string | null
          error_code?: string | null
          error_message?: string | null
          price?: number | null
          price_unit?: string | null
          sent_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      client_stats: {
        Row: {
          id: string | null
          slug: string | null
          business_name: string | null
          status: string | null
          subscription_plan: string | null
          total_leads: number | null
          total_calls: number | null
          total_sms: number | null
          converted_leads: number | null
          created_at: string | null
          last_activity_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      set_client_context: {
        Args: {
          p_client_id: string
        }
        Returns: void
      }
      clear_client_context: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
      get_client_context: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_week_capacity: {
        Args: Record<PropertyKey, never>
        Returns: Array<{
          remaining_spots: number
          is_full: boolean
          current_count: number
          max_capacity: number
        }>
      }
      increment_onboarding_count: {
        Args: Record<PropertyKey, never>
        Returns: Array<{
          success: boolean
          remaining_spots: number
          is_full: boolean
        }>
      }
      reset_weekly_capacity: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
