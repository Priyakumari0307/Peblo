const Note = require('../models/Note');

const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Basic Counts
    const totalNotes = await Note.countByUserId(userId, false);
    const archivedNotes = await Note.countByUserId(userId, true);

    // 2. AI Usage Stats
    const totalAiUsage = await Note.sumAiUsage(userId);

    // 3. Top Tags
    const topTagsRaw = await Note.topTags(userId);
    const topTags = topTagsRaw.map(t => ({
      _id: t.tag,
      count: parseInt(t.count),
    }));

    // 4. Weekly Activity (Last 7 days)
    const weeklyData = await Note.weeklyActivity(userId);
    const formattedActivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayData = weeklyData.find(a => {
        const aDate = a.date instanceof Date ? a.date.toISOString().split('T')[0] : String(a.date).split('T')[0];
        return aDate === dateStr;
      });
      formattedActivity.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        notes: dayData ? parseInt(dayData.count) : 0,
      });
    }

    // 5. Recently Edited Notes
    const recentNotes = await Note.recentNotes(userId);

    res.json({
      totalNotes,
      archivedNotes,
      totalAiUsage,
      topTags,
      weeklyActivity: formattedActivity,
      recentNotes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
