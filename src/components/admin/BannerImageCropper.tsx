import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crop as CropIcon, Loader2, Check, Info } from 'lucide-react';

interface BannerImageCropperProps {
  isOpen: boolean;
  imageFile: File | null;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

// Match the actual banner display ratio (cinema/wide style)
const BANNER_ASPECT_RATIO = 21 / 9;

// Calculate the largest possible crop that fits within the image
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  const imageAspect = mediaWidth / mediaHeight;
  let cropWidth: number;
  let cropHeight: number;

  if (imageAspect > aspect) {
    // Image is wider than crop ratio — limit by height
    cropHeight = 100;
    cropWidth = ((mediaHeight * aspect) / mediaWidth) * 100;
  } else {
    // Image is taller than crop ratio — limit by width
    cropWidth = 100;
    cropHeight = (mediaWidth / aspect / mediaHeight) * 100;
  }

  return centerCrop(
    {
      unit: '%',
      x: (100 - cropWidth) / 2,
      y: (100 - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight,
    },
    mediaWidth,
    mediaHeight
  );
}

export default function BannerImageCropper({
  isOpen,
  imageFile,
  onClose,
  onCropComplete,
}: BannerImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Load image when file changes
  useEffect(() => {
    if (imageFile && isOpen) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(imageFile);
    } else {
      setImgSrc('');
      setCrop(undefined);
      setCompletedCrop(undefined);
    }
  }, [imageFile, isOpen]);

  // Initialize crop when image loads
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, BANNER_ASPECT_RATIO));
  }, []);

  // Convert cropped area to file
  const handleCropAndSave = async () => {
    if (!completedCrop || !imgRef.current || !imageFile) return;

    setIsProcessing(true);

    try {
      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Output size: 1920x823 (21:9 wide banner)
      const outputWidth = 1920;
      const outputHeight = 823;
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No canvas context');

      // High quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw cropped area
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        outputWidth,
        outputHeight
      );

      // Convert to file (JPEG at 90% quality)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }
          const croppedFile = new File([blob], imageFile.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          onCropComplete(croppedFile);
          setIsProcessing(false);
        },
        'image/jpeg',
        0.9
      );
    } catch (error) {
      console.error('Crop failed:', error);
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && imageFile && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[70]"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col">
              {/* ============ HEADER ============ */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-br from-green-50/50 to-white shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white shadow-sm shrink-0">
                    <CropIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      Crop Banner Image
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      Move the box to select the visible area
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* ============ INFO BANNER ============ */}
              <div className="px-4 py-3 sm:px-6 bg-blue-50/50 border-b border-blue-100">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    <strong>Tip:</strong> Drag the box to move it. Keep important content
                    (faces, text) inside the frame — it will show on both desktop and mobile.
                  </p>
                </div>
              </div>

              {/* ============ CROP AREA ============ */}
              <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50 flex items-center justify-center min-h-[300px]">
                {imgSrc && (
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={BANNER_ASPECT_RATIO}
                    locked={true}
                    keepSelection={true}
                    className="max-w-full"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop preview"
                      src={imgSrc}
                      onLoad={onImageLoad}
                      className="max-w-full max-h-[60vh] object-contain"
                    />
                  </ReactCrop>
                )}
              </div>

              {/* ============ PREVIEW INFO ============ */}
              <div className="px-4 py-3 sm:px-6 border-t border-gray-100 bg-white">
                <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 shrink-0">
                      <span className="text-sm">🖥️</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900">Desktop</div>
                      <div className="text-gray-500 text-[10px]">1920×823</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 shrink-0">
                      <span className="text-sm">📱</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900">Mobile</div>
                      <div className="text-gray-500 text-[10px]">Auto-scaled</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 shrink-0">
                      <span className="text-sm">📐</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900">Ratio</div>
                      <div className="text-gray-500 text-[10px]">21:9</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============ FOOTER ============ */}
              <div className="flex items-center justify-end gap-2 px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-100 bg-white shrink-0">
                <button
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropAndSave}
                  disabled={isProcessing || !completedCrop}
                  className="flex-1 sm:flex-initial inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Apply Crop
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}