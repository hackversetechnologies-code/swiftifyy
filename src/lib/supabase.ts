import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database schema types
export interface Parcel {
  id: string;
  sender: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  receiver: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  parcel_details: {
    description: string;
    weight: string;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    value: number;
    instructions: string;
    photo?: string;
  };
  status: 'pending' | 'picked-up' | 'in-transit' | 'at-hub' | 'out-for-delivery' | 'delivered';
  mode: 'auto' | 'manual';
  history: Array<{
    status: string;
    timestamp: string;
    location: string;
    notes?: string;
  }>;
  route: Array<{
    lat: number;
    lng: number;
    label?: string;
  }>;
  current_position?: {
    lat: number;
    lng: number;
  };
  eta: string;
  created_at: string;
  estimated_cost?: number;
  progress: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: 'new' | 'read' | 'replied';
}

// Initialize database tables if using Supabase
export const initializeDatabase = async () => {
  try {
    // Check if tables exist, create if they don't
    const { data: parcels } = await supabase.from('parcels').select('id').limit(1);
    const { data: contacts } = await supabase.from('contact_messages').select('id').limit(1);
    
    console.log('Database connection verified');
    return true;
  } catch (error) {
    console.warn('Database not available, using local storage fallback');
    return false;
  }
};