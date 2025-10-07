import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { deleteMedia, uploadMedia } from '../middlewares/cloud/cloudinary.js';
import { verifyMail } from '../emailVerify/verifyMail.js';
import Session from '../models/session.model.js'
import { sendOtpMail } from '../emailVerify/sendOtpMail.js';

export const register = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      password,
      role,
      firstNiche,
      secondNiche,
      thirdNiche,
    } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All Fields Required",
        success: false
      });
    };

    if (role === "student" && (!firstNiche || !secondNiche || !thirdNiche)) {
      return res.status(400).json({
        message: "Please provide your prefered job niches."
      })
    }

    let uploadedPhoto = ''
    if (req.files?.profilePhoto?.[0]) {
      uploadedPhoto = await uploadMedia(req.files.profilePhoto[0].path); // profile image
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: 'User already exist with this email.',
        success: false,
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      niches: {
        firstNiche,
        secondNiche,
        thirdNiche,
      },
      profile: {
        profilePhoto: uploadedPhoto.secure_url,
      }
    });

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '10m' })
    verifyMail(token, email);
    newUser.token = token
    await newUser.save();

    return res.status(201).json({
      message: "Account created successfully.",
      success: true
    });
  } catch (error) {
    console.log(error);
  }
}

export const verification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing or invalid"
      })
    }
    console.log("auth header", req.headers)
    const token = authHeader.split(" ")[1]

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY)
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration token has expired"
        })
      }
      return res.status(400).json({
        success: false,
        message: "Token verification failed"
      })
    }
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    user.token = null
    user.isVerified = true
    await user.save()

    return res.status(200).json({
      success: true,
      message: "Email verified successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Verify your account then login",
      });
    }

    await Session.deleteOne({ userId: user._id });
    await Session.create({ userId: user._id });

    // ✅ Generate tokens properly
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    // ✅ Set cookies once (not duplicated)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // true on production with HTTPS
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      niches: user.niches,
      isVerified: user.isVerified,
    };

    return res.status(200).json({
      message: `Welcome back ${user.fullname}`,
      user,
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.id;

    await Session.deleteMany({ userId });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills, firstNiche, secondNiche, thirdNiche } = req.body;
    let user = await User.findById(req.id);
    if (!user) return res.status(400).json({ message: "User not found", success: false });

    // Update text fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",");
    if (firstNiche) user.niches.firstNiche = firstNiche;
    if (secondNiche) user.niches.secondNiche = secondNiche;
    if (thirdNiche) user.niches.thirdNiche = thirdNiche;

    // Upload files to Cloudinary
    if (req.files?.profilePhoto?.[0]) {
      const uploadedPhoto = await uploadMedia(req.files.profilePhoto[0].path); // profile image
      user.profile.profilePhoto = uploadedPhoto.secure_url;
    }

    if (req.files?.resume?.[0]) {
      const uploadedResume = await uploadMedia(req.files.resume[0].path, "raw"); // resume PDF/DOC
      user.profile.resumeOriginalName = req.files.resume[0].originalname;
      user.profile.resume = uploadedResume.secure_url;
    }

    await user.save();

    return res.status(200).json({ user, success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const google = async (req, res) => {
  const { fullname, email, profilePhoto } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      const generatePassword =
        Math.random().toString(36).slice(-8) + Math.random().toString().slice(-8);
      const hashedPassword = bcrypt.hashSync(generatePassword, 10);

      user = new User({
        fullname,
        email,
        password: hashedPassword,
        profile: { profilePhoto },
        isVerified: true,
      });

      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

    const data = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      niches: user.niches || {},
      isVerified: true
    };

    return res.status(200)
      .cookie('accessToken', token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax', // allow cross-origin requests from localhost
        secure: false,   // true in production HTTPS
      })
      .json({
        message: `Welcome ${user.fullname}`,
        success: true,
        user: data
      });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();
    await sendOtpMail(email, otp);
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const email = req.params.email;

  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "OTP is required"
    })
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      })
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one"
      })
    }
    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      })
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}

export const changePassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const email = req.params.email;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "All fields are required",
      success: false
    })
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password do not match"
    })
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}