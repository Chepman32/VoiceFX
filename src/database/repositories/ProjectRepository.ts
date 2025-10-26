/**
 * Project Repository - Data access layer for projects
 */

import {db} from '../client';
import {AudioProject} from '@/types/common';

export class ProjectRepository {
  async findAll(): Promise<AudioProject[]> {
    const rows = await db.query<any>(
      'SELECT * FROM projects ORDER BY updated_at DESC'
    );

    return rows.map(this.mapToProject);
  }

  async findById(id: string): Promise<AudioProject | null> {
    const rows = await db.query<any>(
      'SELECT * FROM projects WHERE id = ? LIMIT 1',
      [id]
    );

    return rows.length > 0 ? this.mapToProject(rows[0]) : null;
  }

  async findFavorites(): Promise<AudioProject[]> {
    const rows = await db.query<any>(
      'SELECT * FROM projects WHERE is_favorite = 1 ORDER BY updated_at DESC'
    );

    return rows.map(this.mapToProject);
  }

  async create(project: AudioProject): Promise<void> {
    await db.execute(
      `INSERT INTO projects (id, title, duration, file_uri, thumbnail_uri, created_at, updated_at, is_favorite, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project.id,
        project.title,
        project.duration,
        project.fileUri,
        project.thumbnailUri || null,
        project.createdAt,
        project.updatedAt,
        project.isFavorite ? 1 : 0,
        JSON.stringify(project.tags),
      ]
    );
  }

  async update(id: string, updates: Partial<AudioProject>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.duration !== undefined) {
      fields.push('duration = ?');
      values.push(updates.duration);
    }
    if (updates.fileUri !== undefined) {
      fields.push('file_uri = ?');
      values.push(updates.fileUri);
    }
    if (updates.thumbnailUri !== undefined) {
      fields.push('thumbnail_uri = ?');
      values.push(updates.thumbnailUri);
    }
    if (updates.isFavorite !== undefined) {
      fields.push('is_favorite = ?');
      values.push(updates.isFavorite ? 1 : 0);
    }
    if (updates.tags !== undefined) {
      fields.push('tags = ?');
      values.push(JSON.stringify(updates.tags));
    }

    fields.push('updated_at = ?');
    values.push(new Date().toISOString());

    values.push(id);

    await db.execute(
      `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async delete(id: string): Promise<void> {
    await db.execute('DELETE FROM projects WHERE id = ?', [id]);
  }

  async search(query: string): Promise<AudioProject[]> {
    const rows = await db.query<any>(
      `SELECT * FROM projects
       WHERE title LIKE ? OR tags LIKE ?
       ORDER BY updated_at DESC`,
      [`%${query}%`, `%${query}%`]
    );

    return rows.map(this.mapToProject);
  }

  private mapToProject(row: any): AudioProject {
    return {
      id: row.id,
      title: row.title,
      duration: row.duration,
      fileUri: row.file_uri,
      thumbnailUri: row.thumbnail_uri,
      effects: [], // Effects loaded separately
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isFavorite: row.is_favorite === 1,
      tags: JSON.parse(row.tags || '[]'),
    };
  }
}

export const projectRepository = new ProjectRepository();
