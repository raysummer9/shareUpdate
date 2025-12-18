# ShareUpdate Backend - Implementation Plan

## Overview

This document outlines the complete backend architecture for ShareUpdate, a digital marketplace platform built on **Supabase**. The backend will support three user roles: **Admin**, **Buyer**, and **Seller**, with comprehensive features including authentication, payments, escrow system, messaging, reviews, and disputes.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [Authentication & Authorization](#authentication--authorization)
4. [API Structure](#api-structure)
5. [Implementation Steps](#implementation-steps)
6. [Security Considerations](#security-considerations)

---

## Architecture Overview

### Tech Stack
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for images, documents)
- **Real-time**: Supabase Realtime (for messages, notifications)
- **Edge Functions**: Supabase Edge Functions (for complex business logic)
- **Frontend Integration**: Next.js API Routes + Supabase Client

### Key Features by User Role

#### Buyer
- Browse products/services
- Post requests for sellers to bid on
- Purchase products/services
- Manage wallet (add funds)
- Track orders and trades
- Wishlist management
- Review sellers
- File disputes
- Real-time messaging

#### Seller
- List products/services
- View and bid on buyer requests
- Manage orders and deliveries
- Manage wallet (withdrawals)
- Track active trades/escrow
- Respond to reviews
- Handle disputes
- Real-time messaging

#### Admin (Future)
- User management
- Content moderation
- Dispute resolution
- Platform analytics
- Payment oversight

---

## Database Schema

### Core Tables

#### 1. `profiles` - User Profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'admin')) DEFAULT 'buyer',
  is_verified BOOLEAN DEFAULT FALSE,
  verification_level TEXT DEFAULT 'basic', -- basic, verified, premium
  bio TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  seller_level TEXT DEFAULT NULL, -- null for buyers, 'new', 'rising', 'top_rated' for sellers
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `categories` - Product/Service Categories
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- icon identifier for frontend
  type TEXT NOT NULL CHECK (type IN ('product', 'service', 'both')),
  parent_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `listings` - Products & Services
```sql
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('product', 'service')),
  
  -- Pricing (for products or service base price)
  price DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  
  -- Service-specific pricing tiers (JSON for flexibility)
  pricing_tiers JSONB, -- [{tier: 'basic', price: 25000, delivery_days: 3, features: [...]}, ...]
  
  -- Product-specific fields
  platform TEXT, -- Instagram, YouTube, TikTok, etc.
  account_stats JSONB, -- {followers: 12500, engagement: 4.2, posts: 342, age_months: 18}
  
  -- Media
  images TEXT[], -- array of image URLs
  
  -- Status & Visibility
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'paused', 'sold', 'rejected')),
  rejection_reason TEXT,
  
  -- Delivery
  instant_delivery BOOLEAN DEFAULT FALSE,
  delivery_time_days INTEGER DEFAULT 1,
  
  -- Stats
  views INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- Search optimization
  search_vector TSVECTOR,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. `orders` - Purchase Orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL, -- ORD-2024-XXXXX
  
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  listing_id UUID NOT NULL REFERENCES listings(id),
  
  -- Pricing
  price DECIMAL(12,2) NOT NULL,
  buyer_fee DECIMAL(12,2) NOT NULL, -- Platform fee charged to buyer
  seller_fee DECIMAL(12,2) NOT NULL, -- Platform fee charged to seller
  total_amount DECIMAL(12,2) NOT NULL, -- Total buyer pays
  seller_receives DECIMAL(12,2) NOT NULL, -- Net amount seller receives
  currency TEXT DEFAULT 'NGN',
  
  -- Service-specific (if applicable)
  selected_tier TEXT, -- 'basic', 'standard', 'premium'
  requirements TEXT, -- Buyer's requirements for service
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',      -- Waiting for payment/confirmation
    'paid',         -- Payment received, in escrow
    'processing',   -- Seller is working on delivery
    'delivered',    -- Seller marked as delivered
    'completed',    -- Buyer confirmed receipt
    'cancelled',    -- Cancelled by either party
    'disputed',     -- Under dispute
    'refunded'      -- Refund processed
  )),
  
  -- Delivery
  delivery_deadline TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  delivery_data JSONB, -- Credentials, files, links, etc.
  
  -- Completion
  completed_at TIMESTAMPTZ,
  buyer_confirmed BOOLEAN DEFAULT FALSE,
  auto_complete_at TIMESTAMPTZ, -- Auto-complete if buyer doesn't respond
  
  -- Cancellation/Refund
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES profiles(id),
  cancellation_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5. `escrow_transactions` - Escrow System
```sql
CREATE TABLE escrow_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  
  status TEXT DEFAULT 'held' CHECK (status IN (
    'held',         -- Funds held in escrow
    'released',     -- Released to seller
    'refunded',     -- Refunded to buyer
    'partially_refunded'
  )),
  
  held_at TIMESTAMPTZ DEFAULT NOW(),
  released_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  
  -- For partial refunds in dispute resolution
  refund_amount DECIMAL(12,2),
  release_amount DECIMAL(12,2),
  
  notes TEXT,
  processed_by UUID REFERENCES profiles(id), -- Admin who processed
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 6. `wallets` - User Wallets
```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Balances
  available_balance DECIMAL(12,2) DEFAULT 0,
  pending_balance DECIMAL(12,2) DEFAULT 0, -- In escrow
  total_earned DECIMAL(12,2) DEFAULT 0, -- Lifetime earnings (sellers)
  total_spent DECIMAL(12,2) DEFAULT 0, -- Lifetime spending (buyers)
  total_withdrawn DECIMAL(12,2) DEFAULT 0,
  
  currency TEXT DEFAULT 'NGN',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 7. `wallet_transactions` - Transaction History
```sql
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN (
    'deposit',      -- Buyer adds funds
    'withdrawal',   -- Seller withdraws
    'purchase',     -- Buyer pays for order
    'sale',         -- Seller receives from sale
    'escrow_hold',  -- Funds moved to escrow
    'escrow_release', -- Funds released from escrow
    'refund',       -- Refund received
    'fee',          -- Platform fee
    'bonus'         -- Promotional bonus
  )),
  
  amount DECIMAL(12,2) NOT NULL,
  fee DECIMAL(12,2) DEFAULT 0,
  net_amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  
  -- Reference to related entities
  order_id UUID REFERENCES orders(id),
  
  -- External payment info (for deposits/withdrawals)
  payment_method TEXT, -- 'bank_transfer', 'card', 'crypto'
  payment_reference TEXT,
  external_transaction_id TEXT,
  
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  
  description TEXT,
  metadata JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 8. `bank_accounts` - Withdrawal Accounts
```sql
CREATE TABLE bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  bank_name TEXT NOT NULL,
  bank_code TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  
  is_default BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 9. `buyer_requests` - Buyer Requests (for sellers to bid)
```sql
CREATE TABLE buyer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Budget range
  budget_min DECIMAL(12,2) NOT NULL,
  budget_max DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  
  -- Requirements
  requirements JSONB, -- Specific requirements
  attachments TEXT[], -- Reference images, documents
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'expired')),
  
  deadline TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  bid_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 10. `request_bids` - Seller Bids on Requests
```sql
CREATE TABLE request_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES buyer_requests(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  
  proposal TEXT NOT NULL,
  delivery_days INTEGER NOT NULL,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(request_id, seller_id) -- One bid per seller per request
);
```

#### 11. `reviews` - Product/Seller Reviews
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id),
  
  reviewer_id UUID NOT NULL REFERENCES profiles(id), -- Buyer
  reviewee_id UUID NOT NULL REFERENCES profiles(id), -- Seller
  listing_id UUID NOT NULL REFERENCES listings(id),
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  -- Seller reply
  reply TEXT,
  replied_at TIMESTAMPTZ,
  
  -- Helpfulness
  helpful_count INTEGER DEFAULT 0,
  
  is_public BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 12. `disputes` - Order Disputes
```sql
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_number TEXT UNIQUE NOT NULL, -- DSP-XXXXX
  order_id UUID NOT NULL REFERENCES orders(id),
  
  filed_by UUID NOT NULL REFERENCES profiles(id),
  against_id UUID NOT NULL REFERENCES profiles(id),
  
  reason TEXT NOT NULL CHECK (reason IN (
    'not_as_described',
    'not_delivered',
    'delayed_delivery',
    'quality_issues',
    'access_issues',
    'fraud',
    'other'
  )),
  
  description TEXT NOT NULL,
  buyer_claim TEXT,
  seller_response TEXT,
  
  evidence JSONB, -- [{type: 'image', url: '...', uploaded_by: '...'}, ...]
  
  status TEXT DEFAULT 'open' CHECK (status IN (
    'open',           -- Just filed
    'under_review',   -- Admin reviewing
    'resolved',       -- Resolved with decision
    'closed'          -- Closed without resolution
  )),
  
  resolution TEXT, -- Final decision description
  resolution_type TEXT CHECK (resolution_type IN (
    'buyer_favor',    -- Full refund to buyer
    'seller_favor',   -- Release to seller
    'partial_refund', -- Split
    'mutual_agreement'
  )),
  refund_amount DECIMAL(12,2),
  release_amount DECIMAL(12,2),
  
  resolved_by UUID REFERENCES profiles(id), -- Admin
  resolved_at TIMESTAMPTZ,
  
  deadline TIMESTAMPTZ, -- Response deadline
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 13. `dispute_messages` - Dispute Communication
```sql
CREATE TABLE dispute_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  
  message TEXT NOT NULL,
  attachments TEXT[],
  
  is_admin BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 14. `conversations` - Messaging
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  participant_1 UUID NOT NULL REFERENCES profiles(id),
  participant_2 UUID NOT NULL REFERENCES profiles(id),
  
  -- Optional link to listing/order
  listing_id UUID REFERENCES listings(id),
  order_id UUID REFERENCES orders(id),
  
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  
  -- Unread counts
  participant_1_unread INTEGER DEFAULT 0,
  participant_2_unread INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(participant_1, participant_2)
);
```

#### 15. `messages` - Chat Messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  
  content TEXT NOT NULL,
  attachments JSONB, -- [{type: 'image', url: '...'}, ...]
  
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- For system messages
  is_system BOOLEAN DEFAULT FALSE,
  system_type TEXT, -- 'order_created', 'order_delivered', etc.
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 16. `wishlists` - Buyer Wishlists
```sql
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  
  -- Price alert
  price_alert BOOLEAN DEFAULT FALSE,
  alert_price DECIMAL(12,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, listing_id)
);
```

#### 17. `notifications` - User Notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL, -- 'order', 'message', 'review', 'dispute', 'wallet', 'system'
  title TEXT NOT NULL,
  body TEXT,
  
  -- Link to related entity
  reference_type TEXT, -- 'order', 'listing', 'conversation', 'dispute'
  reference_id UUID,
  
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 18. `platform_settings` - Platform Configuration
```sql
CREATE TABLE platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example entries:
-- ('buyer_fee_percentage', '{"value": 10}')
-- ('seller_fee_percentage', '{"value": 10}')
-- ('escrow_release_days', '{"value": 3}')
-- ('dispute_deadline_hours', '{"value": 48}')
```

---

## Authentication & Authorization

### Registration Flow

1. User submits registration form with:
   - Full name, email, username, phone, password
   - Account type selection (buyer/seller)
   
2. Supabase Auth creates user in `auth.users`

3. Database trigger automatically creates:
   - `profiles` record with selected role
   - `wallets` record with zero balance

4. User receives email verification (Supabase Auth handles this)

5. On first login, user is redirected to appropriate dashboard based on role

### Database Trigger for Profile Creation

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, username, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')
  );
  
  -- Create wallet
  INSERT INTO public.wallets (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ... (all tables)

-- Profile policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Listing policies
CREATE POLICY "Active listings are viewable by everyone"
  ON listings FOR SELECT
  USING (status = 'active' OR seller_id = auth.uid());

CREATE POLICY "Sellers can create listings"
  ON listings FOR INSERT
  WITH CHECK (seller_id = auth.uid() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'seller'
  ));

CREATE POLICY "Sellers can update their own listings"
  ON listings FOR UPDATE
  USING (seller_id = auth.uid());

-- Order policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Wallet policies
CREATE POLICY "Users can view their own wallet"
  ON wallets FOR SELECT
  USING (user_id = auth.uid());

-- Message policies
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
    )
  );
```

---

## API Structure

### Frontend API Integration

The frontend will connect to Supabase using:

1. **Supabase Client** - For direct database queries with RLS
2. **Next.js API Routes** - For complex business logic

### Key API Endpoints (Next.js API Routes)

```
/api/
├── auth/
│   ├── register/         POST - Register new user
│   ├── login/           POST - Login
│   └── profile/         GET, PUT - Get/Update profile
│
├── listings/
│   ├── /                GET - List all (with filters)
│   ├── /[id]/           GET - Get single listing
│   ├── /create/         POST - Create listing (sellers)
│   ├── /[id]/update/    PUT - Update listing
│   └── /[id]/delete/    DELETE - Delete listing
│
├── orders/
│   ├── /                GET - List user's orders
│   ├── /[id]/           GET - Get order details
│   ├── /create/         POST - Create new order
│   ├── /[id]/deliver/   POST - Mark as delivered (seller)
│   ├── /[id]/confirm/   POST - Confirm receipt (buyer)
│   └── /[id]/cancel/    POST - Cancel order
│
├── wallet/
│   ├── /                GET - Get wallet balance
│   ├── /transactions/   GET - Transaction history
│   ├── /deposit/        POST - Initiate deposit
│   ├── /withdraw/       POST - Request withdrawal
│   └── /banks/          GET, POST - Bank accounts
│
├── requests/
│   ├── /                GET - List buyer requests
│   ├── /[id]/           GET - Get request details
│   ├── /create/         POST - Create request (buyer)
│   ├── /[id]/bid/       POST - Submit bid (seller)
│   └── /[id]/accept/    POST - Accept bid (buyer)
│
├── messages/
│   ├── /conversations/  GET - List conversations
│   ├── /[conversationId]/ GET - Get messages
│   └── /send/           POST - Send message
│
├── reviews/
│   ├── /                GET - List reviews
│   ├── /create/         POST - Create review (buyer)
│   └── /[id]/reply/     POST - Reply to review (seller)
│
├── disputes/
│   ├── /                GET - List disputes
│   ├── /[id]/           GET - Get dispute details
│   ├── /create/         POST - File dispute
│   ├── /[id]/respond/   POST - Respond to dispute
│   └── /[id]/message/   POST - Add message to dispute
│
└── wishlist/
    ├── /                GET - Get wishlist
    ├── /add/            POST - Add to wishlist
    └── /[id]/remove/    DELETE - Remove from wishlist
```

---

## Implementation Steps

### Phase 1: Database Setup ✅ COMPLETED
- [x] Create Backend directory and README
- [x] Set up Supabase project
- [x] Create database migrations for all tables (13 migrations)
- [x] Set up Row Level Security policies
- [x] Create database triggers and functions
- [x] Seed initial data (30 categories)

### Phase 2: Authentication ✅ COMPLETED
- [x] Configure Supabase Auth settings
- [x] Implement registration with profile creation (auto-trigger)
- [x] Implement login flow
- [x] Set up role-based redirects (middleware)
- [x] Environment variables configured (.env.local)
- [ ] Email verification setup (configure in Supabase dashboard)
- [ ] Password reset flow (configure in Supabase dashboard)

### Phase 3: Frontend Auth Integration ✅ COMPLETED
- [x] Connect Get Started page to Supabase Auth
- [x] Connect Sign In page to Supabase Auth
- [x] Create auth context/hooks for user state
- [x] Update dashboard layouts with real user data

### Phase 4: Core Features ✅ COMPLETED
- [x] Listings CRUD operations (hooks created)
- [x] Order creation and management (hooks created)
- [x] Wallet and transactions (hooks created)
- [x] Buyer requests and bidding (hooks created)
- [x] Categories hooks
- [x] Reviews hooks
- [x] Connect dashboard pages to real data (seller & buyer overviews)

### Phase 5: Communication ✅ COMPLETED
- [x] Real-time messaging hooks (useConversations, useMessages, useMessageMutations)
- [x] Notification hooks (useNotifications, useNotificationMutations)
- [x] Supabase Realtime subscriptions for live updates
- [x] Sidebar message badges with real unread counts
- [x] Helper functions for order, message, and review notifications
- [ ] Connect messages pages to real data (UI integration pending)

### Phase 6: Advanced Features (Pending)
- [ ] Dispute management hooks
- [ ] Search optimization (full-text search)
- [ ] File uploads (Supabase Storage integration)
- [ ] Wishlist hooks

### Phase 7: Payment Integration (Pending)
- [ ] Payment gateway integration (Paystack/Flutterwave)
- [ ] Deposit flow
- [ ] Withdrawal processing
- [ ] Webhook handling

### Phase 8: Admin Dashboard (Future)
- [ ] Admin authentication
- [ ] User management
- [ ] Content moderation
- [ ] Dispute resolution interface
- [ ] Analytics dashboard

---

## Security Considerations

### Data Protection
1. **RLS Policies**: All tables have row-level security
2. **Input Validation**: All API inputs validated
3. **SQL Injection**: Using Supabase parameterized queries
4. **XSS Prevention**: Sanitize all user-generated content

### Payment Security
1. **Escrow System**: Funds held until delivery confirmed
2. **Transaction Logging**: All wallet movements recorded
3. **Withdrawal Verification**: Bank account verification required
4. **Fraud Detection**: Monitor for suspicious patterns

### Authentication Security
1. **Password Requirements**: Min 8 chars, uppercase, lowercase, number, special char
2. **Rate Limiting**: Prevent brute force attacks
3. **Session Management**: Secure session handling via Supabase
4. **2FA**: Implement for high-value accounts (future)

---

## Environment Variables

Create `.env.local` in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Payment Gateway (for future implementation)
# PAYSTACK_SECRET_KEY=your_paystack_secret
# PAYSTACK_PUBLIC_KEY=your_paystack_public

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Next Steps

After reviewing this document, proceed with:

1. **Review and approve** the database schema
2. **Create migrations** using Supabase MCP tools
3. **Set up authentication** triggers and policies
4. **Connect frontend** to Supabase
5. **Implement features** incrementally

---

## File Structure (Backend)

```
backend/
├── README.md                 # This file
├── migrations/               # Database migration files (optional, using Supabase MCP)
├── functions/                # Supabase Edge Functions
│   ├── create-order/
│   ├── process-payment/
│   ├── release-escrow/
│   └── ...
└── types/                    # TypeScript type definitions
    └── database.types.ts     # Generated from Supabase
```

---

## Questions to Address Before Implementation

1. **Payment Gateway**: Which provider? (Paystack recommended for Nigeria)
2. **Fee Structure**: Current assumption is 10% for both buyer and seller
3. **Escrow Release**: Auto-release after how many days? (Currently 3)
4. **Dispute Timeline**: Response deadline? (Currently 48 hours)
5. **Verification Requirements**: What documents for seller verification?

---

*Last Updated: December 18, 2025*

