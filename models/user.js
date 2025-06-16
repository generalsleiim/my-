const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permissions: { type: [String], default: ['*'] }, // مثلاً: ['*', 'Security', 'Maintenance']
  roles: { type: Object, default: {} } // صلاحيات متقدمة لكل نموذج: { 'Security': ['add', 'view'] }
});

module.exports = mongoose.model('User', userSchema);