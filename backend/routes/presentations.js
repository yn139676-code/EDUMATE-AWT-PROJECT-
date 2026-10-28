const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Presentation = require('../models/Presentation');

const presentationValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('presentationDate').isISO8601().withMessage('Valid presentation date is required'),
];

// GET /api/presentations
router.get('/', async (req, res) => {
  try {
    const presentations = await Presentation.find().sort({ presentationDate: 1 });
    res.json({ success: true, data: presentations, count: presentations.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// POST /api/presentations
router.post('/', presentationValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const presentation = await Presentation.create(req.body);
    res.status(201).json({ success: true, data: presentation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// PUT /api/presentations/:id
router.put('/:id', presentationValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const presentation = await Presentation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!presentation) return res.status(404).json({ success: false, message: 'Presentation not found' });
    res.json({ success: true, data: presentation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// DELETE /api/presentations/:id
router.delete('/:id', async (req, res) => {
  try {
    const presentation = await Presentation.findByIdAndDelete(req.params.id);
    if (!presentation) return res.status(404).json({ success: false, message: 'Presentation not found' });
    res.json({ success: true, message: 'Presentation deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
