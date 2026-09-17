const MAX_IMAGE_SIZE = 10 * 1024 * 1024

const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

export function validateImage(
  file,
  allowedTypes = DEFAULT_ALLOWED_TYPES
) {
  if (!file) {
    return 'Please select an image.'
  }

  if (!(file instanceof File)) {
    return 'Invalid image file.'
  }

  if (!allowedTypes.includes(file.type)) {
    return 'This image format is not supported.'
  }

  if (file.size <= 0) {
    return 'This image file is empty.'
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return 'Image must be smaller than 10 MB.'
  }

  return null
}