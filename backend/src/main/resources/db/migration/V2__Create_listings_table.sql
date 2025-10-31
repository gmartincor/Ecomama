CREATE TYPE listing_type AS ENUM ('OFFER', 'DEMAND');

CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    type listing_type NOT NULL,
    category VARCHAR(50) NOT NULL,
    location geography(Point, 4326) NOT NULL,
    price_amount DECIMAL(10, 2),
    price_currency VARCHAR(3),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_listings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS listing_images (
    listing_id UUID NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    CONSTRAINT fk_listing_images_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_location ON listings USING GIST(location);

CREATE INDEX idx_listings_title_trgm ON listings USING gin(to_tsvector('english', title));
CREATE INDEX idx_listings_description_trgm ON listings USING gin(to_tsvector('english', description));
CREATE INDEX idx_listings_category_lower ON listings(LOWER(category));

CREATE INDEX idx_listings_active ON listings(active) WHERE active = true;
CREATE INDEX idx_listings_type_active ON listings(type, active) WHERE active = true;
