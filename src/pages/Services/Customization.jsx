import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification/Notification";
import { buildApiUrl, readJsonResponse } from "../../config/api";
import bedroom1 from "../../images/bedroom1.jpg";
import dining from "../../images/dining.jpg";
import livingroom1 from "../../images/livingroom1.jpg";
import livingroom2 from "../../images/livingroom2.jpg";
import "./Customization.css";

const carouselImages = [
  { src: bedroom1, alt: "Custom Bedroom Design" },
  { src: livingroom1, alt: "Custom Living Room Design" },
  { src: dining, alt: "Custom Dining Room Design" },
  { src: livingroom2, alt: "Modern Custom Furniture" }
];

function Customization() {
  const navigate = useNavigate();
  const imagePreviewsRef = useRef([]);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    material: '',
    color: '',
    designImages: []
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    imagePreviewsRef.current = formData.designImages;
  }, [formData.designImages]);

  useEffect(() => () => {
    imagePreviewsRef.current.forEach(image => URL.revokeObjectURL(image.previewUrl));
  }, []);

  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${Date.now()}-${index}`,
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    setFormData(prev => ({
      ...prev,
      designImages: [...prev.designImages, ...files]
    }));
  };

  const removeImage = (imageId) => {
    setFormData(prev => {
      const imageToRemove = prev.designImages.find(image => image.id === imageId);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return {
        ...prev,
        designImages: prev.designImages.filter(image => image.id !== imageId)
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('Please sign in to submit a customization request.');
      navigate('/signin');
      return;
    }

    if (formData.designImages.length === 0) {
      showNotification('Please upload at least one design inspiration image to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category', formData.category);
      formDataToSend.append('project_description', formData.description);
      formDataToSend.append('preferred_material', formData.material);
      formDataToSend.append('color_finish', formData.color);

      formData.designImages.forEach(({ file }) => {
        formDataToSend.append('design_inspiration', file);
      });

      const response = await fetch(buildApiUrl('/customer/customization'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const data = await readJsonResponse(response);

      if (response.ok) {
        showNotification('Customization request submitted successfully.', 'success');
        setTimeout(() => {
          navigate('/customization-confirmation');
        }, 600);
      } else {
        showNotification(data.message || 'Failed to submit customization request.');
      }
    } catch {
      showNotification('Failed to submit customization request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="customization-container">
        <div className="carousel-banner">
          <div className="carousel-container">
            <button className="carousel-btn prev-btn" onClick={prevImage} type="button">&lt;</button>
            <div className="carousel-image-container">
              <img
                src={carouselImages[currentImageIndex].src}
                alt={carouselImages[currentImageIndex].alt}
                className="carousel-image"
              />
              <div className="carousel-overlay">
                <h2>Custom Furniture Design</h2>
                <p>Transform your ideas into reality</p>
              </div>
            </div>
            <button className="carousel-btn next-btn" onClick={nextImage} type="button">&gt;</button>
          </div>
          <div className="carousel-indicators">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
                type="button"
              />
            ))}
          </div>
        </div>

        <div className="customization-form-container">
          <h1>Start Your Custom Project</h1>
          <p>Tell us about your dream furniture piece and we'll bring it to life</p>

          <form className="customization-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                <option value="bedroom">Bedroom Furniture</option>
                <option value="living-room">Living Room Furniture</option>
                <option value="dining-room">Dining Room Furniture</option>
                <option value="office">Office Furniture</option>
                <option value="outdoor">Outdoor Furniture</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Project Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your custom furniture project in detail..."
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="material">Preferred Material *</label>
                <select
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select material</option>
                  <option value="wood">Solid Wood</option>
                  <option value="oak">Oak</option>
                  <option value="walnut">Walnut</option>
                  <option value="mahogany">Mahogany</option>
                  <option value="pine">Pine</option>
                  <option value="metal">Metal</option>
                  <option value="upholstered">Upholstered</option>
                  <option value="mixed">Mixed Materials</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="color">Color/Finish *</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="e.g., Natural oak, Dark walnut, White painted"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="designImages">Design Inspirations *</label>
              <div className="file-upload-area">
                <input
                  type="file"
                  id="designImages"
                  name="designImages"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                <label htmlFor="designImages" className="file-upload-label">
                  <div className="upload-icon">Files</div>
                  <p>Upload at least one design inspiration image</p>
                  <small>PNG, JPG up to 10MB each (Required)</small>
                </label>
              </div>

              {formData.designImages.length > 0 && (
                <div className="uploaded-images">
                  <h4>Uploaded Images:</h4>
                  <div className="image-preview-grid">
                    {formData.designImages.map((image, index) => (
                      <div key={image.id} className="image-preview">
                        <img src={image.previewUrl} alt={`Design ${index + 1}`} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImage(image.id)}
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Custom Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Customization;
