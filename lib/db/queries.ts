import pool from './index';

export interface Upload {
  id: number;
  text_content: string;
  image_url: string | null; // This is now the S3 key, not the full URL
  created_at: Date;
  updated_at: Date;
}

/**
 * Insert a new upload record
 */
export async function createUpload(
  textContent: string,
  imageUrl: string | null = null
): Promise<Upload> {
  const query = `
    INSERT INTO uploads (text_content, image_url)
    VALUES ($1, $2)
    RETURNING *
  `;
  
  const result = await pool.query(query, [textContent, imageUrl]);
  return result.rows[0];
}

/**
 * Get all uploads, ordered by created_at descending
 */
export async function getUploads(limit: number = 50): Promise<Upload[]> {
  const query = `
    SELECT * FROM uploads
    ORDER BY created_at DESC
    LIMIT $1
  `;
  
  const result = await pool.query(query, [limit]);
  return result.rows;
}

/**
 * Get a single upload by ID
 */
export async function getUploadById(id: number): Promise<Upload | null> {
  const query = `
    SELECT * FROM uploads
    WHERE id = $1
  `;
  
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

/**
 * Update an upload's image URL
 */
export async function updateUploadImage(
  id: number,
  imageUrl: string
): Promise<Upload> {
  const query = `
    UPDATE uploads
    SET image_url = $1
    WHERE id = $2
    RETURNING *
  `;
  
  const result = await pool.query(query, [imageUrl, id]);
  return result.rows[0];
}
