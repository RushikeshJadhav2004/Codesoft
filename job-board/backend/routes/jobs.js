const express = require('express');
const Job = require('../models/Job');
const { auth, isEmployer } = require('../middleware/auth');

const router = express.Router();

// Get all jobs with search and filter
router.get('/', async (req, res) => {
  try {
    const {
      search,
      location,
      category,
      type,
      experience,
      remote,
      page = 1,
      limit = 10,
      featured
    } = req.query;

    let query = { status: 'active' };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (location) query.location = new RegExp(location, 'i');
    if (category) query.category = category;
    if (type) query.type = type;
    if (experience) query.experience = experience;
    if (remote) query.remote = remote === 'true';
    if (featured) query.featured = featured === 'true';

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate('employer', 'name profile.company')
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured jobs
router.get('/featured', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active', featured: true })
      .populate('employer', 'name profile.company')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name email profile.company profile.website');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create job (Employers only)
router.post('/', auth, isEmployer, async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      employer: req.user._id
    };

    const job = new Job(jobData);
    await job.save();

    const populatedJob = await Job.findById(job._id)
      .populate('employer', 'name profile.company');

    res.status(201).json(populatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job (Employers only)
router.put('/:id', auth, isEmployer, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user owns this job
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('employer', 'name profile.company');

    res.json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job (Employers only)
router.delete('/:id', auth, isEmployer, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user owns this job
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get jobs by employer
router.get('/employer/me', auth, isEmployer, async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
