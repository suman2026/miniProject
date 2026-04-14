import {asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req , res) => { 
//  get user details from frontend 
const {username, email, fullname, password} = req.body;
console.log(req.body)



// validation - non empty   

if([username, email, fullname, password].some((field) => field?.trim() === "")) { 
    throw new ApiError(400, "All fields are required");
}
//  check if user already exists: username or email 
const existUser = await User.findone ({ 
    $or: [{ username }, { email}]
})
if (existUser) {
    throw new ApiError(400, "User already exists with this username or email");
}

//  check for image, check for avatar
const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path; 


// upload them to cloudinary, avatar and images 
if(!avatarLocalPath) { 
    throw new ApiError(400, "Avatar file is required");
}

const avatar = await uploadToCloudinary(avatarLocalPath);
const coverImage = await uploadToCloudinary(coverImageLocalPath);

if (!avatar) { 
    throw new ApiError(400, "Avatar upload required");
}
// create user object  - create entry in db

const user = await User.create({ 
    fullname, 
    avatar: avatar.url, 
    coverImage: coverImage?.url || "", 
    email, 
    password, 
    username: username.toLowerCase()
})

// remove password and refresh token fro the response 

const createdUser = await User.findById(user._id).select(
    "-password, -refreshToken "
)

//  check for user creation 

if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");

}

// return response to frontend

return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
)
 
})

export { registerUser } 