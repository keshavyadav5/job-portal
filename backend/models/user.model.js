import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minLength: [2, "Name must contain at least 2 characters"],
    maxLength: [30, "Name cannot exceed 30 characters"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    default: null
    // required: true,
    // length: [10, "Number must be 10 characters"]
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'recruiter'],
    default: "student"
  },
  niches: {
    firstNiche: { type: String, default: "" },
    secondNiche: { type: String, default: "" },
    thirdNiche: { type: String, default: "" },
  },
  profile: {
    bio: { type: String },
    skills: [{ type: String }],
    resume: { type: String }, // URL to resume file
    resumeOriginalName: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    profilePhoto: {
      type: String,
      default: ""
    }
  },

  isVerified: { type: Boolean, default: false },
  token: { type: String, default: null },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null }
}, { timestamps: true });


const User = mongoose.model("User", userSchema)

export default User