(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/lib/imageUtils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * Utility functions for handling images in the application
 */ __turbopack_context__.s({
    "generateFallbackImage": (()=>generateFallbackImage),
    "getProxiedFirebaseUrl": (()=>getProxiedFirebaseUrl),
    "getSafeImageUrl": (()=>getSafeImageUrl),
    "isFirebaseStorageUrl": (()=>isFirebaseStorageUrl),
    "isPlaceholderUrl": (()=>isPlaceholderUrl)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebaseUtils.ts [app-client] (ecmascript)");
;
const isPlaceholderUrl = (url)=>{
    return url && typeof url === 'string' && (url.includes('via.placeholder.com') || url.includes('placeholder.com') || url.includes('placehold.co'));
};
const isFirebaseStorageUrl = (url)=>{
    return url && typeof url === 'string' && (url.includes('firebasestorage.googleapis.com') || url.includes('firebasestorage.app'));
};
const generateFallbackImage = (text = 'Image')=>{
    // Extract filename from placeholder URL if possible
    let displayText = text;
    try {
        if (text.includes('text=')) {
            const encodedText = text.split('text=')[1].split('&')[0];
            displayText = decodeURIComponent(encodedText);
        }
    } catch (e) {
        console.error('Error extracting text from placeholder URL:', e);
    }
    // Generate a colored rectangle with the filename
    const colors = [
        '#4285F4',
        '#34A853',
        '#FBBC05',
        '#EA4335',
        '#5E35B1',
        '#1E88E5',
        '#43A047',
        '#E53935',
        '#FB8C00',
        '#00ACC1'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" fill="${color}" />
      <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="white">${displayText}</text>
    </svg>
  `;
    // Convert SVG to base64 data URL
    const base64Image = `data:image/svg+xml;base64,${btoa(svgContent.trim())}`;
    return base64Image;
};
const getProxiedFirebaseUrl = (url)=>{
    if (!url || typeof url !== 'string') return '';
    // If it's already a proxied URL or not a Firebase Storage URL, return as is
    if (!isFirebaseStorageUrl(url) || url.includes('/api/firebase-image')) {
        return url;
    }
    // First transform the URL into proper Firebase Storage format
    const transformedUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transformFirebaseStorageUrl"])(url);
    // Then proxy it through our API route
    return `/api/firebase-image?url=${encodeURIComponent(transformedUrl)}`;
};
const getSafeImageUrl = (originalUrl)=>{
    // If it's not a valid URL, return a fallback
    if (!originalUrl || typeof originalUrl !== 'string') {
        return generateFallbackImage('Image');
    }
    // If it's a placeholder URL, replace with a base64 image
    if (isPlaceholderUrl(originalUrl)) {
        return generateFallbackImage(originalUrl);
    }
    // If it's a Firebase Storage URL, use our proxy route
    if (isFirebaseStorageUrl(originalUrl)) {
        return getProxiedFirebaseUrl(originalUrl);
    }
    // Otherwise, return the original URL
    return originalUrl;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/firebaseStorageHelper.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/**
 * Firebase Storage Helper for managing and transforming Firebase Storage URLs
 * This file centralizes all operations related to Firebase Storage URLs
 */ /**
 * Transform a Firebase Storage URL to a direct download URL format
 * Handles the various formats that Firebase Storage URLs can have
 */ __turbopack_context__.s({
    "getDirectDownloadUrl": (()=>getDirectDownloadUrl),
    "getProxiedUrl": (()=>getProxiedUrl),
    "getSafeImageUrl": (()=>getSafeImageUrl)
});
function getDirectDownloadUrl(url) {
    if (!url || typeof url !== 'string') return '';
    // If it's not a Firebase Storage URL, return as is
    if (!url.includes('firebasestorage.googleapis.com') && !url.includes('firebasestorage.app')) {
        return url;
    }
    try {
        // Case 1: URL with ?name= parameter
        // Format: https://firebasestorage.googleapis.com/v0/b/[bucket]/o?name=[path]
        if (url.includes('/o?name=')) {
            // Extract the bucket name
            const bucketPart = url.split('/b/')[1];
            const bucket = bucketPart.split('.')[0];
            // Extract the file path from the name parameter
            let path = '';
            if (url.includes('name=')) {
                path = url.split('name=')[1];
                // Remove any additional query parameters
                if (path.includes('&')) {
                    path = path.split('&')[0];
                }
            }
            // Decode then re-encode the path properly
            const decodedPath = decodeURIComponent(path);
            // Build a proper download URL
            return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(decodedPath)}?alt=media`;
        }
        // Case 2: URL with /o/ path but missing alt=media
        // Format: https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]
        if (url.includes('/o/') && !url.includes('alt=media')) {
            // Add alt=media parameter
            return url.includes('?') ? `${url}&alt=media` : `${url}?alt=media`;
        }
        // Case 3: URL already has /o/ and alt=media, so it's good to go
        if (url.includes('/o/') && url.includes('alt=media')) {
            return url;
        }
        // Case 4: Fallback for any other Firebase Storage URL format
        console.warn('Unknown Firebase Storage URL format:', url);
        return url.includes('?') ? `${url}&alt=media` : `${url}?alt=media`;
    } catch (error) {
        console.error('Error transforming Firebase Storage URL:', error);
        return url;
    }
}
function getProxiedUrl(url) {
    if (!url || typeof url !== 'string') return '';
    // Don't proxy non-Firebase URLs or already proxied URLs
    if (!url.includes('firebasestorage.googleapis.com') && !url.includes('firebasestorage.app') || url.includes('/api/firebase-image')) {
        return url;
    }
    // First transform to direct download URL
    const directUrl = getDirectDownloadUrl(url);
    // Then proxy it
    return `/api/firebase-image?url=${encodeURIComponent(directUrl)}`;
}
function getSafeImageUrl(url) {
    if (!url || typeof url !== 'string') return '';
    // Handle Firebase Storage URLs
    if (url.includes('firebasestorage.googleapis.com') || url.includes('firebasestorage.app')) {
        return getProxiedUrl(url);
    }
    // Return other URLs as is
    return url;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/FirebaseImage.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>FirebaseImage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$imageUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/imageUtils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseStorageHelper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebaseStorageHelper.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function FirebaseImage({ src, alt, width = 300, height = 300, fallbackText, priority = false, loading, ...props }) {
    _s();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Store the safe image URL
    const [safeSrc, setSafeSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FirebaseImage.useEffect": ()=>{
            if (!src || typeof src !== 'string' || src === '') {
                // Use fallback image for empty or invalid src
                setSafeSrc((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$imageUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateFallbackImage"])(fallbackText || alt?.toString() || 'Image'));
                setIsLoading(false);
                return;
            }
            try {
                // Get a safe, CORS-friendly image URL
                const safeUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseStorageHelper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSafeImageUrl"])(src);
                console.log('Using safe image URL:', {
                    original: src,
                    transformed: safeUrl
                });
                setSafeSrc(safeUrl);
            } catch (err) {
                console.error('Error processing image URL:', err);
                setSafeSrc((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$imageUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateFallbackImage"])(fallbackText || alt?.toString() || 'Image'));
            }
            // Reset error state
            setError(false);
            setIsLoading(true);
        }
    }["FirebaseImage.useEffect"], [
        src,
        alt,
        fallbackText
    ]);
    // Generate a fallback image if needed
    const fallbackImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$imageUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateFallbackImage"])(fallbackText || alt?.toString() || 'Image');
    // Use the fallback if there's an error or if safeSrc is null
    const imageSrc = error || !safeSrc ? fallbackImage : safeSrc;
    const handleLoad = ()=>{
        setIsLoading(false);
    };
    const handleError = ()=>{
        console.warn(`Failed to load image: ${safeSrc}`);
        setError(true);
        setIsLoading(false);
    };
    // Only render Image component when we have a valid src
    if (!imageSrc) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative overflow-hidden bg-gray-100 flex items-center justify-center",
            style: {
                width,
                height,
                background: '#f3f4f6'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-8 h-8 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin"
            }, void 0, false, {
                fileName: "[project]/components/FirebaseImage.tsx",
                lineNumber: 79,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/FirebaseImage.tsx",
            lineNumber: 75,
            columnNumber: 7
        }, this);
    }
    // Create image props
    const imageProps = {
        src: imageSrc,
        alt: alt || "Image",
        width: width,
        height: height,
        onError: handleError,
        onLoad: handleLoad,
        ...props,
        className: `${props.className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`
    };
    // Handle priority vs loading prop correctly
    if (priority) {
        imageProps.priority = true;
    // Don't set loading when priority is true
    } else if (loading) {
        imageProps.loading = loading;
    } else {
        imageProps.loading = 'lazy';
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative overflow-hidden",
        style: {
            background: '#f3f4f6'
        },
        children: [
            isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex items-center justify-center bg-gray-100",
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-8 h-8 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin"
                }, void 0, false, {
                    fileName: "[project]/components/FirebaseImage.tsx",
                    lineNumber: 113,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/FirebaseImage.tsx",
                lineNumber: 109,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                ...imageProps
            }, void 0, false, {
                fileName: "[project]/components/FirebaseImage.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/FirebaseImage.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
_s(FirebaseImage, "OiJjMpRNT1MjkQt3Sd19dF3BLl4=");
_c = FirebaseImage;
var _c;
__turbopack_context__.k.register(_c, "FirebaseImage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(admin)/dashboard/products/[id]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>EditProductPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/authContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebaseUtils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FirebaseImage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/FirebaseImage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
// Categories for dropdown
const categories = [
    'electronics',
    'clothing',
    'accessories',
    'home',
    'books',
    'sports',
    'beauty',
    'toys',
    'kitchen'
];
function EditProductPage({ params }) {
    _s();
    // Unwrap the params Promise using React.use()
    const unwrappedParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    const productId = unwrappedParams.id;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, isAdmin } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // Product state
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [price, setPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [category, setCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [stock, setStock] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [features, setFeatures] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [images, setImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // UI state
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDeleting, setIsDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [imageUploading, setImageUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newImages, setNewImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [imagePreviews, setImagePreviews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [showDeleteConfirm, setShowDeleteConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Check auth
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditProductPage.useEffect": ()=>{
            if (user && !isLoading) {
                setLoading(false);
            }
        }
    }["EditProductPage.useEffect"], [
        user,
        isLoading
    ]);
    // Fetch product
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditProductPage.useEffect": ()=>{
            const fetchProduct = {
                "EditProductPage.useEffect.fetchProduct": async ()=>{
                    try {
                        if (!productId) return;
                        const product = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProductById"])(productId);
                        if (!product) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Product not found');
                            router.push('/dashboard/products');
                            return;
                        }
                        // Set product data
                        setName(product.name);
                        setDescription(product.description);
                        setPrice(product.price.toString());
                        setCategory(product.category);
                        setStock(product.stock.toString());
                        setFeatures(product.features || []);
                        setImages(product.images || []);
                    } catch (error) {
                        console.error('Error fetching product:', error);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Failed to load product');
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["EditProductPage.useEffect.fetchProduct"];
            fetchProduct();
        }
    }["EditProductPage.useEffect"], [
        productId,
        router
    ]);
    const handleInputChange = (e)=>{
        const { name, value } = e.target;
        switch(name){
            case 'name':
                setName(value);
                break;
            case 'description':
                setDescription(value);
                break;
            case 'price':
                setPrice(value);
                break;
            case 'category':
                setCategory(value);
                break;
            case 'stock':
                setStock(value);
                break;
        }
        // Clear error
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };
    const handleFeatureChange = (index, value)=>{
        const newFeatures = [
            ...features
        ];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };
    const addFeatureField = ()=>{
        setFeatures([
            ...features,
            ''
        ]);
    };
    const removeFeatureField = (index)=>{
        setFeatures(features.filter((_, i)=>i !== index));
    };
    const handleImageChange = (e)=>{
        const files = e.target.files;
        if (!files) return;
        const fileArray = Array.from(files);
        setNewImages([
            ...newImages,
            ...fileArray
        ]);
        // Create and store image previews
        const newPreviews = fileArray.map((file)=>URL.createObjectURL(file));
        setImagePreviews([
            ...imagePreviews,
            ...newPreviews
        ]);
    };
    const removeImage = (index)=>{
        // Remove preview and revoke object URL
        URL.revokeObjectURL(imagePreviews[index]);
        // Remove from arrays
        const newPreviews = [
            ...imagePreviews
        ];
        const newImageFiles = [
            ...newImages
        ];
        newPreviews.splice(index, 1);
        newImageFiles.splice(index, 1);
        setImagePreviews(newPreviews);
        setNewImages(newImageFiles);
    };
    const removeExistingImage = (index)=>{
        const newImages = [
            ...images
        ];
        newImages.splice(index, 1);
        setImages(newImages);
    };
    const validateForm = ()=>{
        const newErrors = {};
        if (!name.trim()) {
            newErrors.name = 'Product name is required';
        }
        if (!description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!price) {
            newErrors.price = 'Price is required';
        } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            newErrors.price = 'Price must be a positive number';
        }
        if (!category) {
            newErrors.category = 'Category is required';
        }
        if (!stock) {
            newErrors.stock = 'Stock quantity is required';
        } else if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
            newErrors.stock = 'Stock must be a non-negative number';
        }
        if (images.length === 0 && newImages.length === 0) {
            newErrors.images = 'At least one product image is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!validateForm()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Please fix form errors');
            return;
        }
        setIsSaving(true);
        try {
            // First upload any new images
            let allImages = [
                ...images
            ];
            if (newImages.length > 0) {
                setImageUploading(true);
                // Upload each image sequentially and gather URLs
                for (const imageFile of newImages){
                    try {
                        // Upload the image and transform the URL for CORS compatibility
                        const imageUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadProductImage"])(imageFile);
                        // Make sure the URL is correctly formatted for Firebase Storage
                        const transformedUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transformFirebaseStorageUrl"])(imageUrl);
                        // Add the image URL to our array
                        allImages.push(transformedUrl);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Uploaded image: ${imageFile.name}`);
                    } catch (uploadError) {
                        console.error('Failed to upload an image:', uploadError);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Failed to upload image: ${imageFile.name}`);
                    }
                }
                setImageUploading(false);
            }
            // Update product with all data including new image URLs
            const productData = {
                name,
                description,
                price: parseFloat(price),
                category,
                stock: parseInt(stock),
                features: features.filter((f)=>f.trim() !== ''),
                images: allImages,
                updatedAt: new Date().toISOString()
            };
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProduct"])(productId, productData);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Product updated successfully');
            // Clear new images and previews
            imagePreviews.forEach((preview)=>URL.revokeObjectURL(preview));
            setNewImages([]);
            setImagePreviews([]);
            // Redirect back to dashboard
            router.push('/dashboard/products');
        } catch (error) {
            console.error('Error updating product:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Failed to update product');
        } finally{
            setIsSaving(false);
        }
    };
    const handleDelete = async ()=>{
        if (!productId) return;
        setIsDeleting(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteProduct"])(productId);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Product deleted successfully');
            router.push('/dashboard/products');
        } catch (error) {
            console.error('Error deleting product:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Failed to delete product');
        } finally{
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };
    if (loading || !user || !isAdmin) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-pulse",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-8 bg-gray-200 rounded w-1/4 mb-6"
                    }, void 0, false, {
                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                        lineNumber: 290,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-64 bg-gray-200 rounded mb-6"
                    }, void 0, false, {
                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                        lineNumber: 291,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                lineNumber: 289,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
            lineNumber: 288,
            columnNumber: 7
        }, this);
    }
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-pulse",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-8 bg-gray-200 rounded w-1/4 mb-6"
                    }, void 0, false, {
                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                        lineNumber: 301,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-64 bg-gray-200 rounded mb-6"
                    }, void 0, false, {
                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                        lineNumber: 302,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-40 bg-gray-200 rounded"
                    }, void 0, false, {
                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                        lineNumber: 303,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                lineNumber: 300,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
            lineNumber: 299,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold text-gray-900",
                        children: "Edit Product"
                    }, void 0, false, {
                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                        lineNumber: 312,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex space-x-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard",
                                className: "bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                lineNumber: 314,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowDeleteConfirm(true),
                                className: "bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-md",
                                disabled: isDeleting,
                                children: isDeleting ? 'Deleting...' : 'Delete Product'
                            }, void 0, false, {
                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                lineNumber: 320,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                        lineNumber: 313,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                lineNumber: 311,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white shadow rounded-lg overflow-hidden mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 border-b border-gray-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-medium text-gray-900 mb-4",
                                        children: "Basic Information"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                        lineNumber: 333,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "md:col-span-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "name",
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Product Name"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 337,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        id: "name",
                                                        name: "name",
                                                        value: name,
                                                        onChange: handleInputChange,
                                                        className: `w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 340,
                                                        columnNumber: 17
                                                    }, this),
                                                    errors.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 text-sm text-red-600",
                                                        children: errors.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 348,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                lineNumber: 336,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "md:col-span-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "description",
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Description"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 352,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        id: "description",
                                                        name: "description",
                                                        value: description,
                                                        onChange: handleInputChange,
                                                        rows: 4,
                                                        className: `w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 355,
                                                        columnNumber: 17
                                                    }, this),
                                                    errors.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 text-sm text-red-600",
                                                        children: errors.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 363,
                                                        columnNumber: 40
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                lineNumber: 351,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "price",
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Price ($)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 367,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        id: "price",
                                                        name: "price",
                                                        value: price,
                                                        onChange: handleInputChange,
                                                        className: `w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 370,
                                                        columnNumber: 17
                                                    }, this),
                                                    errors.price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 text-sm text-red-600",
                                                        children: errors.price
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 378,
                                                        columnNumber: 34
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                lineNumber: 366,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "category",
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Category"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 382,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        id: "category",
                                                        name: "category",
                                                        value: category,
                                                        onChange: handleInputChange,
                                                        className: `w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "Select Category"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                                lineNumber: 392,
                                                                columnNumber: 19
                                                            }, this),
                                                            categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: cat,
                                                                    children: cat.charAt(0).toUpperCase() + cat.slice(1)
                                                                }, cat, false, {
                                                                    fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                                    lineNumber: 394,
                                                                    columnNumber: 21
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 385,
                                                        columnNumber: 17
                                                    }, this),
                                                    errors.category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 text-sm text-red-600",
                                                        children: errors.category
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 399,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                lineNumber: 381,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "stock",
                                                        className: "block text-sm font-medium text-gray-700 mb-1",
                                                        children: "Stock"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 403,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        id: "stock",
                                                        name: "stock",
                                                        min: "0",
                                                        value: stock,
                                                        onChange: handleInputChange,
                                                        className: `w-full border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 406,
                                                        columnNumber: 17
                                                    }, this),
                                                    errors.stock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 text-sm text-red-600",
                                                        children: errors.stock
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 415,
                                                        columnNumber: 34
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                lineNumber: 402,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                        lineNumber: 335,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                lineNumber: 332,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 border-b border-gray-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-medium text-gray-900",
                                                children: "Features"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                lineNumber: 422,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: addFeatureField,
                                                className: "text-sm text-indigo-600 hover:text-indigo-800",
                                                children: "+ Add Feature"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                lineNumber: 423,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                        lineNumber: 421,
                                        columnNumber: 13
                                    }, this),
                                    features.map((feature, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex mb-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: feature,
                                                    onChange: (e)=>handleFeatureChange(index, e.target.value),
                                                    placeholder: `Feature ${index + 1}`,
                                                    className: "flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                    lineNumber: 434,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>removeFeatureField(index),
                                                    className: "ml-2 text-red-600 hover:text-red-800",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "h-5 w-5",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        viewBox: "0 0 24 24",
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                            lineNumber: 447,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 446,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                    lineNumber: 441,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                            lineNumber: 433,
                                            columnNumber: 15
                                        }, this)),
                                    features.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-500",
                                        children: 'No features added yet. Click "Add Feature" to add product features.'
                                    }, void 0, false, {
                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                        lineNumber: 454,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                lineNumber: 420,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-medium text-gray-900 mb-2",
                                                children: "Images"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                lineNumber: 460,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500",
                                                children: "Add product images (up to 5). First image will be used as the main product image."
                                            }, void 0, false, {
                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                lineNumber: 461,
                                                columnNumber: 15
                                            }, this),
                                            errors.images && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-sm text-red-600",
                                                children: errors.images
                                            }, void 0, false, {
                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                lineNumber: 462,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                        lineNumber: 459,
                                        columnNumber: 13
                                    }, this),
                                    images.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-sm font-medium text-gray-700 mb-2",
                                                children: "Current Images"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                lineNumber: 468,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
                                                children: images.map((imageUrl, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FirebaseImage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    src: imageUrl,
                                                                    alt: `Product image ${index + 1}`,
                                                                    width: 200,
                                                                    height: 200,
                                                                    className: "object-cover object-center w-full h-full",
                                                                    fallbackText: `Product ${index + 1}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                                    lineNumber: 473,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                                lineNumber: 472,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>removeExistingImage(index),
                                                                className: "absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "h-4 w-4",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    viewBox: "0 0 24 24",
                                                                    xmlns: "http://www.w3.org/2000/svg",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M6 18L18 6M6 6l12 12"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                                        lineNumber: 488,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                                    lineNumber: 487,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                                lineNumber: 482,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, index, true, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 471,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                lineNumber: 469,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                        lineNumber: 467,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-sm font-medium text-gray-700 mb-2",
                                                children: "Add New Images"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                lineNumber: 499,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center mb-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "sr-only",
                                                            children: "Choose images"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                            lineNumber: 502,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "file",
                                                            accept: "image/*",
                                                            multiple: true,
                                                            onChange: handleImageChange,
                                                            className: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 "
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                            lineNumber: 503,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                    lineNumber: 501,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                lineNumber: 500,
                                                columnNumber: 15
                                            }, this),
                                            imagePreviews.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
                                                children: imagePreviews.map((preview, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: preview,
                                                                    alt: `New upload preview ${index + 1}`,
                                                                    className: "object-cover object-center w-full h-full"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                                    lineNumber: 524,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                                lineNumber: 523,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>removeImage(index),
                                                                className: "absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "h-4 w-4",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    viewBox: "0 0 24 24",
                                                                    xmlns: "http://www.w3.org/2000/svg",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M6 18L18 6M6 6l12 12"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                                        lineNumber: 536,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                                    lineNumber: 535,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                                lineNumber: 530,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, `new-${index}`, true, {
                                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                        lineNumber: 522,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                                lineNumber: 520,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                        lineNumber: 498,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                lineNumber: 458,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                        lineNumber: 331,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end space-x-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard",
                                className: "bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-sm hover:bg-gray-50",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                lineNumber: 548,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: isSaving || imageUploading,
                                className: "bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400",
                                children: isSaving ? 'Saving...' : imageUploading ? 'Uploading Images...' : 'Save Changes'
                            }, void 0, false, {
                                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                lineNumber: 554,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                        lineNumber: 547,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                lineNumber: 330,
                columnNumber: 7
            }, this),
            showDeleteConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative p-5 bg-white w-full max-w-md m-4 rounded-lg shadow-xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-medium text-gray-900 mb-4",
                            children: "Delete Product"
                        }, void 0, false, {
                            fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                            lineNumber: 568,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 mb-6",
                            children: "Are you sure you want to delete this product? This action cannot be undone."
                        }, void 0, false, {
                            fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                            lineNumber: 569,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end space-x-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowDeleteConfirm(false),
                                    className: "bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-sm hover:bg-gray-50",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                    lineNumber: 573,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleDelete,
                                    disabled: isDeleting,
                                    className: "bg-red-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400",
                                    children: isDeleting ? 'Deleting...' : 'Delete Product'
                                }, void 0, false, {
                                    fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                                    lineNumber: 579,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                            lineNumber: 572,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                    lineNumber: 567,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
                lineNumber: 566,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(admin)/dashboard/products/[id]/page.tsx",
        lineNumber: 310,
        columnNumber: 5
    }, this);
}
_s(EditProductPage, "Abs4pVlJAvCUAf8zh10oqPX1elE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = EditProductPage;
var _c;
__turbopack_context__.k.register(_c, "EditProductPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_19495af1._.js.map