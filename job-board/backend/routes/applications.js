const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { auth, isEmployer, isJobSeeker } = require('../middleware/auth');
const upload = require('../config/multer');
const { sendApplicationNotification, sendApplicationConfirmation } = require('../config/email');

const router = express.Router();

// Apply for job (Job seekers only)
router.post('/', auth, isJobSeeker, upload.single('resume'), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    // Check if job exists
    const job = await Job.findById(jobId).populate('employer', 'email name');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = new Application({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume: req.file.path
    });

    await application.save();

    // Increment applications count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 }
    });

    // Send notifications
    try {
      await sendApplicationNotification(
        job.employer.email,
        job.title,
        req.user.name
      );
      await sendApplicationConfirmation(
        req.user.email,
        job.title,
        job.company
      );
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    const populatedApplication = await Application.findById(application._id)
      .populate('job', 'title company')
      .populate('applicant', 'name email');

    res.status(201).json({
      message: 'Application submitted successfully',
      application: populatedApplication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for a job (Employers only)
router.get('/job/:jobId', auth, isEmployer, async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job belongs to the employer
    const job = await Job.findById(jobId);
    if (!job || job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email profile')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's applications (Job seekers only)
router.get('/my-applications', auth, isJobSeeker, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type status')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (Employers only)
router.patch('/:id/status', auth, isEmployer, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('job', 'employer');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if job belongs to the employer
    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    if (notes) application.notes = notes;
    await application.save();

    res.json({ message: 'Application status updated', application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single application
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title company location employer')
      .populate('applicant', 'name email profile');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check authorization
    const isApplicant = application.applicant._id.toString() === req.user._id.toString();
    const isEmployer = application.job.employer.toString() === req.user._id.toString();

    if (!isApplicant && !isEmployer) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
