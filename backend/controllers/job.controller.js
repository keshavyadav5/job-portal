import Job from "../models/job.model.js";
import mongoose from "mongoose";

// for admin
export const postJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
    const userId = req.id;

    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
      return res.status(400).json({
        message: "All fields required",
        success: false
      })
    };
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId
    });
    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}

// for students
export const getAllJobs = async (req, res) => {
  try {
    const keyboard = req.query.keyboard || "";
    const query = {
      $or: [
        { title: { $regex: keyboard, $options: "i" } },
        { description: { $regex: keyboard, $options: "i" } }
      ]
    }
    const jobs = await Job.find(query).populate({
      path: "company"
    }).sort({ createdAt: -1 })
    if (!jobs) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      })
    }

    return res.status(200).json({
      jobs,
      success: true
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}

// for students
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      })
    }

    return res.status(200).json({
      job,
      success: true
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}


export const updateJob = async (req, res) => {
  const {
    title,
    description,
    requirements,
    salary,
    location,
    jobType,
    experience,
    position,
  } = req.body;

  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID format.",
        success: false,
      });
    }

    const job = await Job.findById(jobId).populate({
      path: "company"
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    if (title?.trim()) job.title = title.trim();
    if (description?.trim()) job.description = description.trim();
    if (requirements) {
      if (typeof requirements === "string") {
        job.requirements = requirements
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean);
      } else {
        job.requirements = requirements;
      }
    }
    if (salary !== undefined) job.salary = salary;
    if (location?.trim()) job.location = location.trim();
    if (jobType?.trim()) job.jobType = jobType.trim();
    if (experience !== undefined) job.experienceLevel = experience;
    if (position !== undefined) job.position = position;

    await job.save();

    return res.status(200).json({
      message: "Job updated successfully.",
      success: true,
      job,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message,
    });
  }
};

export const deleteJob = async (req,res) => {
  try {
     const jobId = req.params.id;
     await Job.findByIdAndDelete(jobId);
     return res.status(200).json({
      message: "Job deleted successfully",
      success: true
     })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}


// for admin
export const getJobsByAdmin = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: 'company'
    })
    if (!jobs) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      })
    }

    return res.status(200).json({
      jobs,
      success: true
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}