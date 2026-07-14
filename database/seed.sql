-- EventVenue Database Schema and Seed Data
-- Run this in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'customer',
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Venues Table
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INTEGER NOT NULL,
  price_per_head DECIMAL(10, 2) NOT NULL,
  description TEXT,
  amenities JSONB DEFAULT '[]',
  rating DECIMAL(3, 2) DEFAULT 5.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  venue_id UUID NOT NULL REFERENCES venues(id),
  event_date DATE NOT NULL,
  guest_count INTEGER NOT NULL,
  decoration_theme VARCHAR(100),
  catering_option VARCHAR(100),
  entertainment_service VARCHAR(100),
  special_requests TEXT,
  total_price DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event Timeline Table
CREATE TABLE IF NOT EXISTS event_timelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  manager_id UUID REFERENCES users(id),
  phase VARCHAR(100),
  start_date DATE,
  end_date DATE,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timeline_id UUID NOT NULL REFERENCES event_timelines(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'todo',
  due_date DATE,
  priority VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  rating DECIMAL(3, 2) DEFAULT 5.0,
  availability BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Admin Users
INSERT INTO users (email, first_name, last_name, role, phone) VALUES
  ('admin@eventvenue.com', 'Admin', 'User', 'admin', '1234567890'),
  ('john.manager@eventvenue.com', 'John', 'Manager', 'manager', '1234567891'),
  ('emma.staff@eventvenue.com', 'Emma', 'Staff', 'staff', '1234567892'),
  ('michael.staff@eventvenue.com', 'Michael', 'Staff', 'staff', '1234567893'),
  ('customer@eventvenue.com', 'Sarah', 'Customer', 'customer', '1234567894');

-- Insert Venues
INSERT INTO venues (name, location, capacity, price_per_head, description, amenities, rating) VALUES
  ('Grand Ballroom Estate', 'Manhattan, NY', 500, 150.00, 'Luxurious ballroom with modern amenities', '["AC", "WiFi", "Parking", "Kitchen", "DJ"]', 4.9),
  ('Riverside Garden Pavilion', 'Brooklyn, NY', 300, 85.00, 'Beautiful outdoor garden venue', '["Garden", "Outdoor", "Parking"]', 4.8),
  ('Contemporary Loft Downtown', 'Manhattan, NY', 250, 120.00, 'Modern industrial loft', '["Skylights", "Kitchen", "Exposed Brick"]', 4.7),
  ('Rustic Barn Retreat', 'Hudson Valley, NY', 200, 75.00, 'Charming country barn', '["Outdoor", "Lighting", "Accessible"]', 4.9),
  ('Seaside Luxury Resort', 'East Hampton, NY', 400, 180.00, 'Premium beachfront venue', '["Ocean View", "Beach", "Spa"]', 5.0),
  ('Historic Manor House', 'Queens, NY', 350, 95.00, 'Classic historic estate', '["Historic", "Gardens", "Multiple Rooms"]', 4.8);

-- Insert Vendors
INSERT INTO vendors (name, category, email, phone, rating, availability) VALUES
  ('Premium Catering Co', 'catering', 'catering@premium.com', '555-0101', 4.9, true),
  ('Elegant Florals', 'decoration', 'hello@elegant.com', '555-0102', 4.8, true),
  ('Studio Lens Photography', 'photography', 'contact@lens.com', '555-0103', 4.9, true),
  ('Live Events Entertainment', 'entertainment', 'bookings@live.com', '555-0104', 4.7, true),
  ('Gourmet Delights Catering', 'catering', 'contact@gourmet.com', '555-0105', 4.8, true),
  ('Garden Design Studio', 'decoration', 'design@garden.com', '555-0106', 4.6, true),
  ('Professional Photographers', 'photography', 'hello@proph.com', '555-0107', 4.9, true),
  ('DJ & Sound Services', 'entertainment', 'booking@dj.com', '555-0108', 4.7, true);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_venue_id ON bookings(venue_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_event_timelines_booking_id ON event_timelines(booking_id);
CREATE INDEX IF NOT EXISTS idx_tasks_timeline_id ON tasks(timeline_id);
