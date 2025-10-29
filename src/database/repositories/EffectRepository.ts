/**
 * Effect Repository - Data access layer for effects
 */

import {db} from '../client';
import {VoiceEffect} from '@/types/common';

export class EffectRepository {
  async findAll(): Promise<VoiceEffect[]> {
    const rows = await db.query<any>(
      'SELECT * FROM effects ORDER BY name ASC'
    );

    return rows.map(this.mapToEffect);
  }

  async findById(id: string): Promise<VoiceEffect | null> {
    const rows = await db.query<any>(
      'SELECT * FROM effects WHERE id = ? LIMIT 1',
      [id]
    );

    return rows.length > 0 ? this.mapToEffect(rows[0]) : null;
  }

  async findByType(type: VoiceEffect['type']): Promise<VoiceEffect[]> {
    const rows = await db.query<any>(
      'SELECT * FROM effects WHERE type = ? ORDER BY name ASC',
      [type]
    );

    return rows.map(this.mapToEffect);
  }

  async findProEffects(): Promise<VoiceEffect[]> {
    const rows = await db.query<any>(
      'SELECT * FROM effects WHERE is_pro = 1 ORDER BY name ASC'
    );

    return rows.map(this.mapToEffect);
  }

  async findFreeEffects(): Promise<VoiceEffect[]> {
    const rows = await db.query<any>(
      'SELECT * FROM effects WHERE is_pro = 0 ORDER BY name ASC'
    );

    return rows.map(this.mapToEffect);
  }

  async create(effect: VoiceEffect): Promise<void> {
    await db.execute(
      `INSERT INTO effects (id, name, type, parameters, is_pro, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        effect.id,
        effect.name,
        effect.type,
        JSON.stringify(effect.parameters),
        effect.isPro ? 1 : 0,
        effect.createdAt,
        effect.updatedAt,
      ]
    );
  }

  async update(id: string, updates: Partial<VoiceEffect>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.type !== undefined) {
      fields.push('type = ?');
      values.push(updates.type);
    }
    if (updates.parameters !== undefined) {
      fields.push('parameters = ?');
      values.push(JSON.stringify(updates.parameters));
    }
    if (updates.isPro !== undefined) {
      fields.push('is_pro = ?');
      values.push(updates.isPro ? 1 : 0);
    }

    fields.push('updated_at = ?');
    values.push(new Date().toISOString());

    values.push(id);

    await db.execute(
      `UPDATE effects SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async delete(id: string): Promise<void> {
    await db.execute('DELETE FROM effects WHERE id = ?', [id]);
  }

  async getProjectEffects(projectId: string): Promise<VoiceEffect[]> {
    const rows = await db.query<any>(
      `SELECT e.* FROM effects e
       INNER JOIN project_effects pe ON e.id = pe.effect_id
       WHERE pe.project_id = ?
       ORDER BY pe.order_index ASC`,
      [projectId]
    );

    return rows.map(this.mapToEffect);
  }

  async addEffectToProject(
    projectId: string,
    effectId: string,
    orderIndex: number
  ): Promise<void> {
    await db.execute(
      `INSERT INTO project_effects (project_id, effect_id, order_index, created_at)
       VALUES (?, ?, ?, ?)`,
      [projectId, effectId, orderIndex, new Date().toISOString()]
    );
  }

  async removeEffectFromProject(
    projectId: string,
    effectId: string
  ): Promise<void> {
    await db.execute(
      'DELETE FROM project_effects WHERE project_id = ? AND effect_id = ?',
      [projectId, effectId]
    );
  }

  async updateEffectOrder(
    projectId: string,
    effectId: string,
    newOrderIndex: number
  ): Promise<void> {
    await db.execute(
      'UPDATE project_effects SET order_index = ? WHERE project_id = ? AND effect_id = ?',
      [newOrderIndex, projectId, effectId]
    );
  }

  private mapToEffect(row: any): VoiceEffect {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      parameters: JSON.parse(row.parameters),
      isPro: row.is_pro === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const effectRepository = new EffectRepository();
