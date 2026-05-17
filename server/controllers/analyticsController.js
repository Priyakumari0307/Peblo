const Note = require('../models/Note');
const mongoose = require('mongoose');

const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Basic Counts
    const totalNotes = await Note.countDocuments({ userId, isArchived: false });
    const archivedNotes = await Note.countDocuments({ userId, isArchived: true });
    
    // 2. AI Usage Stats (Sum of aiUsageCount)
    const aiStats = await Note.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalAiUsage: { $sum: "$aiUsageCount" } } }
    ]);
    const totalAiUsage = aiStats.length > 0 ? aiStats[0].totalAiUsage : 0;

    // 3. Top Tags
    const topTags = await Note.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // 4. Weekly Activity (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyActivity = await Note.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Format weekly activity to ensure all days are present
    const formattedActivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayData = weeklyActivity.find(a => a._id === dateStr);
      formattedActivity.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        notes: dayData ? dayData.count : 0
      });
    }

    // 5. Recently Edited Notes
    const recentNotes = await Note.find({ userId: new mongoose.Types.ObjectId(userId), isArchived: false })
      .sort({ updatedAt: -1 })
      .limit(3)
      .select('title updatedAt category');

    res.json({
      totalNotes,
      archivedNotes,
      totalAiUsage,
      topTags,
      weeklyActivity: formattedActivity,
      recentNotes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
