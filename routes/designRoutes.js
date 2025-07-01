const express = require('express');
const router = express.Router();
const Design = require('../models/design');

// Get all designs
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const designs = await Design.find(query).populate('category');
    res.json(designs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new design
router.post('/', async (req, res) => {
  const design = new Design({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
 category: req.body.category
    });

  try {
    const newDesign = await design.save();
    res.status(201).json(newDesign);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update design 
router.put('/:id', async (req, res) => {
  try {
    const updatedDesign = await Design.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ); 
    res.json(updatedDesign);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete design
router.delete('/:id', async (req, res) => { 
  try {
    await Design.findByIdAndDelete(req.params.id);
    res.json({ message: 'Design deleted' });
    console.log(res);
    
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
}); 

module.exports = router;