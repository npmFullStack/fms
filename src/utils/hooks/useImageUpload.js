import { useState, useEffect } from "react";

const useImageUpload = (maxSize = 5 * 1024 * 1024) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size
      if (file.size > maxSize) {
        setError(`File size too large. Maximum ${maxSize / (1024 * 1024)}MB allowed.`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Only image files are allowed.");
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setSelectedFile(file);
      setError(""); // Clear any previous error messages
    } else {
      setPreviewImage(null);
      setSelectedFile(null);
    }
  };

  const clearImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setSelectedFile(null);
    setError("");
  };

  // Cleanup preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return {
    previewImage,
    selectedFile,
    error,
    handleImageChange,
    clearImage
  };
};

export default useImageUpload;