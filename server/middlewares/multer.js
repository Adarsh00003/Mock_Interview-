import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure public directory exists
const publicDir = "public";
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public")
    },
    filename: function(req, file, cb){
        const filename = Date.now() + "-" + file.originalname;
        cb(null, filename)
    }
})

const fileFilter = (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf') {
        cb(null, true)
    } else {
        cb(new Error('Only PDF files are allowed'), false)
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});