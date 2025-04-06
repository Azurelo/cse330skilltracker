const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    progress: { type: Number, default: 0 },
    resources: [String], 
    completed: { type: Boolean, default: false },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Goal', GoalSchema);
