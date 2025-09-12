import fs from "fs/promises";
import path from "path";

// Function to delete an image from the local filesystem
export const deleteImage = async (filename: string) => {
  if (!filename) {
    throw new Error("No filename provided for deletion.");
  }

  // Adjust this to your actual uploads directory
  const uploadDir = path.join(__dirname, "uploads");
  const filePath = path.join(uploadDir, filename);

  try {
    await fs.unlink(filePath);
    return { message: "Image deleted successfully." };
  } catch (error) {
    // File not found or other error
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image.");
  }
};