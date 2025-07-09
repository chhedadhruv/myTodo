import express from 'express';
import { body, validationResult, query } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All task routes require authentication
router.use(authenticateToken);

// Get all tasks with filtering
router.get('/', [
  query('status').optional().isIn(['all', 'active', 'completed']),
  query('priority').optional().isIn(['low', 'medium', 'high']),
  query('sort').optional().isIn(['created_at', 'updated_at', 'due_date', 'priority']),
  query('order').optional().isIn(['asc', 'desc']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { status = 'all', priority, sort = 'created_at', order = 'desc', page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE user_id = $1';
    let params = [req.user.id];
    let paramCount = 1;

    // Add status filter
    if (status !== 'all') {
      paramCount++;
      whereClause += ` AND status = $${paramCount}`;
      params.push(status);
    }

    // Add priority filter
    if (priority) {
      paramCount++;
      whereClause += ` AND priority = $${paramCount}`;
      params.push(priority);
    }

    // Build query
    const query = `
      SELECT 
        id, title, description, status, priority, due_date, 
        created_at, updated_at 
      FROM tasks 
      ${whereClause}
      ORDER BY ${sort} ${order.toUpperCase()}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) FROM tasks ${whereClause}`;
    const countResult = await pool.query(countQuery, params.slice(0, paramCount));
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      tasks: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, title, description, status, priority, due_date, created_at, updated_at FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task: result.rows[0] });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create task
router.post('/', [
  body('title').isLength({ min: 1, max: 255 }).trim().escape(),
  body('description').optional().isLength({ max: 1000 }).trim(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('due_date').isISO8601().toDate().custom((value) => {
    if (new Date(value) < new Date()) {
      throw new Error('Due date must be in the future');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { title, description, priority = 'medium', due_date } = req.body;

    const result = await pool.query(
      'INSERT INTO tasks (user_id, title, description, priority, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, title, description, priority, due_date]
    );

    res.status(201).json({
      message: 'Task created successfully',
      task: result.rows[0]
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task
router.put('/:id', [
  body('title').optional().isLength({ min: 1, max: 255 }).trim().escape(),
  body('description').optional().isLength({ max: 1000 }).trim(),
  body('status').optional().isIn(['active', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('due_date').optional().isISO8601().toDate().custom((value) => {
    if (new Date(value) < new Date()) {
      throw new Error('Due date must be in the future');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { title, description, status, priority, due_date } = req.body;

    // Check if task exists and belongs to user
    const existingTask = await pool.query(
      'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existingTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 0;

    if (title !== undefined) {
      paramCount++;
      updates.push(`title = $${paramCount}`);
      values.push(title);
    }

    if (description !== undefined) {
      paramCount++;
      updates.push(`description = $${paramCount}`);
      values.push(description);
    }

    if (status !== undefined) {
      paramCount++;
      updates.push(`status = $${paramCount}`);
      values.push(status);
    }

    if (priority !== undefined) {
      paramCount++;
      updates.push(`priority = $${paramCount}`);
      values.push(priority);
    }

    if (due_date !== undefined) {
      paramCount++;
      updates.push(`due_date = $${paramCount}`);
      values.push(due_date);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id, req.user.id);

    const query = `
      UPDATE tasks 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount + 1} AND user_id = $${paramCount + 2}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.json({
      message: 'Task updated successfully',
      task: result.rows[0]
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle task status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE tasks 
       SET status = CASE 
         WHEN status = 'active' THEN 'completed'
         ELSE 'active'
       END
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      message: 'Task status toggled successfully',
      task: result.rows[0]
    });
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 