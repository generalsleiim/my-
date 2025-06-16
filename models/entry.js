const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  modelName: { type: String, required: true }, // اسم النموذج (مثال: الأمن الإداري، الكاميرات)
  data: { type: Object, required: true },     // البيانات الفعلية للإدخال (مثال: { "الاسم": "أحمد", "التاريخ": "2025-06-16" })
  __user: { type: String, required: true },   // المستخدم الذي قام بالإدخال
  __date: { type: String, required: true },   // تاريخ الإدخال
  // إذا كنت ستحفظ مسارات الملفات:
  // filePath: { type: String, required: false }
}, { timestamps: true }); // لإضافة createdAt و updatedAt تلقائياً

module.exports = mongoose.model('Entry', entrySchema);