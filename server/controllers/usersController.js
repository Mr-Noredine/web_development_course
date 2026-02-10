import pool from '../config/database.js';

// ═══════════════════════════════════════════════════════════
// GET USER PROGRESS
// ═══════════════════════════════════════════════════════════
export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      `SELECT 
        up.*,
        c.name as category_name,
        c.slug as category_slug,
        c.icon_color
      FROM user_progress up
      JOIN categories c ON up.category_id = c.id
      WHERE up.user_id = $1
      ORDER BY c.name, up.level`,
      [userId]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la progression'
    });
  }
};

// ═══════════════════════════════════════════════════════════
// GET USER ATTEMPTS HISTORY
// ═══════════════════════════════════════════════════════════
export const getUserAttempts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;
    
    const result = await pool.query(
      `SELECT 
        ea.*,
        e.prompt as exercise_prompt,
        e.level,
        c.name as category_name,
        c.slug as category_slug
      FROM exercise_attempts ea
      LEFT JOIN exercises e ON ea.exercise_id = e.id
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE ea.user_id = $1
      ORDER BY ea.completed_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
    
  } catch (error) {
    console.error('Error fetching user attempts:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'historique'
    });
  }
};

// ═══════════════════════════════════════════════════════════
// GET USER STATS
// ═══════════════════════════════════════════════════════════
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await pool.query(
      `SELECT 
        COUNT(DISTINCT exercise_id) as total_exercises_completed,
        COUNT(*) as total_attempts,
        AVG(percentage) as average_score,
        SUM(time_spent) as total_time_spent
      FROM exercise_attempts
      WHERE user_id = $1`,
      [userId]
    );
    
    const categoryStats = await pool.query(
      `SELECT 
        c.name as category,
        COUNT(*) as attempts,
        AVG(ea.percentage) as avg_score
      FROM exercise_attempts ea
      JOIN exercises e ON ea.exercise_id = e.id
      JOIN categories c ON e.category_id = c.id
      WHERE ea.user_id = $1
      GROUP BY c.name
      ORDER BY c.name`,
      [userId]
    );
    
    res.json({
      success: true,
      overall: stats.rows[0],
      byCategory: categoryStats.rows
    });
    
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};