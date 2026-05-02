# CareConnect — MongoDB Database Schema

## Collection 1: users
Contains registration and profile data for donors, NGOs, and admins.
- **Indexes**:
  - `email`: Unique index for login.
  - `role`: Faster filtering by user type.

## Collection 2: fooddonations
Surplus food posts.
- **Indexes**:
  - `pickupLocation`: 2dsphere index for geolocation-based "near" queries.
  - `status, createdAt`: Compound index for efficient list filtering.
  - `safeUntil`: TTL index (expireAfterSeconds: 0) for auto-expiry.

## Collection 3: events
Volunteering and drive events.
- **Indexes**:
  - `date, status`: For sorting and filtering upcoming events.
  - `organizer`: For NGO-specific dashboard views.

## Collection 4: childprofiles
Anonymized children profiles for sponsorship.
- **Indexes**:
  - `anonymousId`: Unique identifier for privacy.
  - `orphanageId`: Link to the NGO managing the child.

## Collection 5: sponsorships
Monthly support records.
- **Indexes**:
  - `sponsor, status`: For user's active sponsorship list.
  - `child`: To prevent double sponsorships if needed.

## Relationships
- **users** (1) → (many) **fooddonations** [donor]
- **users** (1) → (many) **fooddonations** [claimedBy]
- **users** (1) → (many) **events** [organizer]
- **users** (many) ↔ (many) **events** [registeredVolunteers]
- **users** (1) → (many) **sponsorships** [sponsor]
- **childprofiles** (1) → (many) **sponsorships** [child]
