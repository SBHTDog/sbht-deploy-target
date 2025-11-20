-- Create uploads table to store text content and related metadata
CREATE TABLE IF NOT EXISTS uploads (
  id SERIAL PRIMARY KEY,
  text_content TEXT NOT NULL,
  image_url VARCHAR(512),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for better query performance
CREATE INDEX IF NOT EXISTS idx_uploads_created_at ON uploads(created_at DESC);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to call the function
CREATE TRIGGER update_uploads_updated_at 
  BEFORE UPDATE ON uploads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
