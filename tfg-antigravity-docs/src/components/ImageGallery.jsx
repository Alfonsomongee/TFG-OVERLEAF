import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './ImageGallery.module.css';
import { imageGalleryData } from '../data/imageGalleryData';

export default function ImageGallery({}) {
  const lang = useDocLang();
  const [selectedImage, setSelectedImage] = useState(null);

  // Prevent body scrolling when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  // Handle hash navigation
  useEffect(() => {
    if (window.location.hash) {
      const hashId = window.location.hash.substring(1);
      if (hashId.startsWith('fig-')) {
        setTimeout(() => {
          const el = document.getElementById(hashId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.style.transition = 'outline 0.3s ease';
            el.style.outline = '3px solid var(--ifm-color-primary)';
            setTimeout(() => { el.style.outline = 'none'; }, 2000);
          }
        }, 300);
      }
    }
  }, []);

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeModal = () => setSelectedImage(null);
  
  // Prevent clicks inside the image container from closing the modal
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.galleryContainer}>
      {imageGalleryData.chapters.map((chapter) => (
        <div key={chapter.id} className={styles.chapterGroup}>
          <h2 className={styles.chapterTitle}>
            {chapter[`title_${lang}`] || chapter.title_es}
          </h2>
          <div className={styles.imageGrid}>
            {chapter.images.map((img, index) => {
              const caption = img[`caption_${lang}`] || img.caption_es;
              const imageUrl = useBaseUrl(img.src);
              const safeId = img.src.split('/').pop().split('.')[0].replace(/[^a-z0-9-_]/gi, '').toLowerCase();
              
              return (
                <div 
                  key={index} 
                  id={`fig-${safeId}`}
                  className={styles.imageCard}
                  onClick={() => setSelectedImage({ url: imageUrl, caption })}
                  title={lang === 'en' ? "Click to enlarge" : "Clic para ampliar"}
                >
                  <div className={styles.imageThumbnailWrapper}>
                    <img 
                      src={imageUrl} 
                      alt={`Gallery image ${index + 1}`} 
                      className={styles.imageThumbnail}
                      loading="lazy" 
                    />
                  </div>
                  <div className={styles.imageCaption}>
                    {caption}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className={styles.lightboxOverlay} 
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
        >
          <button 
            className={styles.lightboxCloseButton} 
            onClick={closeModal}
            aria-label={lang === 'en' ? "Close" : "Cerrar"}
          >
            &times;
          </button>
          
          <div className={styles.lightboxImageContainer} onClick={handleModalContentClick}>
            <img 
              src={selectedImage.url} 
              alt="Enlarged gallery view" 
              className={styles.lightboxImage} 
            />
          </div>
          
          <div className={styles.lightboxCaption} onClick={handleModalContentClick}>
            {selectedImage.caption}
          </div>
        </div>
      )}
    </div>
  );
}
