# Setting Up Cloudinary for Image Storage

This project uses Cloudinary as a free alternative to Firebase Storage for image hosting.

## 1. Create a Cloudinary Account

1. Visit [Cloudinary](https://cloudinary.com/) and sign up for a free account
2. The free tier includes 25GB storage and 25GB monthly bandwidth

## 2. Find Your Cloudinary Credentials

1. Go to your Cloudinary Dashboard
2. Note your Cloud Name from the dashboard
3. Create an upload preset:
   - Go to Settings > Upload
   - Click "Add upload preset"
   - Name it "next_ecommerce"
   - Set "Signing Mode" to "Unsigned"
   - Save the settings

## 3. Configure Environment Variables

1. Rename `.env.local.cloudinary` to `.env.local`
2. Update the Cloudinary values:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=del7xvxl7
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=next_ecommerce
   ```

## 4. Verify Functionality

1. Start your server with `npm run dev`
2. Upload a product image in the admin dashboard
3. Confirm the image is uploaded to Cloudinary

## How it Works

1. `lib/cloudinaryUtils.ts` - Contains Cloudinary functionality
2. `components/CloudImage.tsx` - Component for displaying images
3. `uploadProductImage` - Modified to use Cloudinary instead of Firebase

## Benefits of Using Cloudinary

1. **Free Tier**: Generous free tier for development and small applications
2. **No CORS Issues**: Built-in CORS support for direct image access
3. **Image Transformations**: Automatic resizing, cropping, and optimization
4. **CDN Delivery**: Fast global content delivery network
5. **Easy Integration**: Simple direct upload from browser

The Cloudinary integration seamlessly replaces Firebase Storage without requiring changes to the database structure or other parts of the application. 