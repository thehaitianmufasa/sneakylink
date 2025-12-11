import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      event_name,
      event_time,
      event_source_url,
      fbp,
      fbc,
      custom_data,
      client_slug
    } = body;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client_id from slug
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('slug', client_slug)
      .single();

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Create event record
    const { data, error } = await supabase
      .from('meta_events')
      .insert({
        client_id: client.id,
        event_name,
        event_time: new Date(event_time).toISOString(),
        event_source_url,
        fbp,
        fbc,
        user_agent: request.headers.get('user-agent'),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        custom_data,
        event_id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      })
      .select()
      .single();

    if (error) throw error;

    // TODO: Send to Meta Conversions API (Phase 4)

    return NextResponse.json({ success: true, event_id: data.id });

  } catch (error) {
    console.error('Meta event tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
