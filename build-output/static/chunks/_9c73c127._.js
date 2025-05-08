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
const isPlaceholderUrl = (url)=>{
    return url && typeof url === 'string' && (url.includes('via.placeholder.com') || url.includes('placeholder.com') || url.includes('placehold.co'));
};
const isFirebaseStorageUrl = (url)=>{
    return url && typeof url === 'string' && url.includes('firebasestorage.googleapis.com');
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
    // Build the proxy URL
    return `/api/firebase-image?url=${encodeURIComponent(url)}`;
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
;
var _s = __turbopack_context__.k.signature();
'use client';
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
                // Process the source URL to make it safe
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$imageUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFirebaseStorageUrl"])(src)) {
                    // Use proxy route for Firebase Storage URLs
                    const proxiedUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$imageUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProxiedFirebaseUrl"])(src);
                    console.log('Using proxied Firebase URL:', proxiedUrl);
                    setSafeSrc(proxiedUrl);
                } else {
                    // Use the original URL for non-Firebase sources
                    setSafeSrc(src);
                }
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
                lineNumber: 84,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/FirebaseImage.tsx",
            lineNumber: 80,
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
                    lineNumber: 118,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/FirebaseImage.tsx",
                lineNumber: 114,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                ...imageProps
            }, void 0, false, {
                fileName: "[project]/components/FirebaseImage.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/FirebaseImage.tsx",
        lineNumber: 112,
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
"[project]/components/ProductCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ProductCard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cartContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FirebaseImage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/FirebaseImage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
function ProductCard({ product, priority = false }) {
    _s();
    const { addItem } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const [isHovered, setIsHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleAddToCart = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success(`Added ${product.name} to cart`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: `/products/${product.id}`,
        className: "group relative card-shadow bg-white rounded-md overflow-hidden transition-all duration-300",
        onMouseEnter: ()=>setIsHovered(true),
        onMouseLeave: ()=>setIsHovered(false),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full bg-gray-100 overflow-hidden aspect-square relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FirebaseImage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: product.images[0],
                        alt: product.name,
                        className: `w-full h-full object-cover object-center transition-opacity duration-300 ${isHovered && product.images.length > 1 ? 'opacity-0' : 'opacity-100'}`,
                        width: 300,
                        height: 300,
                        priority: priority,
                        fallbackText: product.name
                    }, void 0, false, {
                        fileName: "[project]/components/ProductCard.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    product.images.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FirebaseImage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: product.images[1],
                        alt: `${product.name} - secondary view`,
                        className: `w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`,
                        width: 300,
                        height: 300,
                        fallbackText: `${product.name} - alt`
                    }, void 0, false, {
                        fileName: "[project]/components/ProductCard.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleAddToCart,
                        className: `absolute bottom-4 right-4 bg-[#ff7043] text-white py-2 px-3 rounded-full transition-all duration-300 shadow-md ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "h-5 w-5",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M12 6v6m0 0v6m0-6h6m-6 0H6"
                            }, void 0, false, {
                                fileName: "[project]/components/ProductCard.tsx",
                                lineNumber: 64,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/ProductCard.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ProductCard.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ProductCard.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-sm text-gray-700 font-medium truncate",
                        children: product.name
                    }, void 0, false, {
                        fileName: "[project]/components/ProductCard.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-lg font-semibold text-gray-900",
                        children: [
                            "$",
                            product.price.toFixed(2)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ProductCard.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    product.rating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center",
                                children: [
                                    0,
                                    1,
                                    2,
                                    3,
                                    4
                                ].map((rating)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: `h-3 w-3 ${product.rating > rating ? 'text-yellow-400' : 'text-gray-300'}`,
                                        xmlns: "http://www.w3.org/2000/svg",
                                        viewBox: "0 0 20 20",
                                        fill: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ProductCard.tsx",
                                            lineNumber: 86,
                                            columnNumber: 19
                                        }, this)
                                    }, rating, false, {
                                        fileName: "[project]/components/ProductCard.tsx",
                                        lineNumber: 77,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/ProductCard.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "ml-1 text-xs text-gray-500",
                                children: [
                                    "(",
                                    product.reviews,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ProductCard.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ProductCard.tsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this),
                    product.stock <= 5 && product.stock > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-orange-600",
                            children: [
                                "Only ",
                                product.stock,
                                " left"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ProductCard.tsx",
                            lineNumber: 96,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ProductCard.tsx",
                        lineNumber: 95,
                        columnNumber: 11
                    }, this),
                    product.stock === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-red-600",
                            children: "Out of stock"
                        }, void 0, false, {
                            fileName: "[project]/components/ProductCard.tsx",
                            lineNumber: 102,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ProductCard.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ProductCard.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ProductCard.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_s(ProductCard, "nuLnsQxR5FntDofwMkh2Cyuz6Wg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"]
    ];
});
_c = ProductCard;
var _c;
__turbopack_context__.k.register(_c, "ProductCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(main)/products/category/[category]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>CategoryPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebaseUtils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ProductCard.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// Map category IDs to display names
const categoryNames = {
    'electronics': 'Electronics',
    'clothing': 'Clothing',
    'accessories': 'Accessories',
    'furniture': 'Furniture',
    'home': 'Home & Garden',
    'kitchen': 'Kitchen & Home'
};
const sortOptions = [
    {
        value: 'featured',
        label: 'Featured'
    },
    {
        value: 'price-asc',
        label: 'Price: Low to High'
    },
    {
        value: 'price-desc',
        label: 'Price: High to Low'
    },
    {
        value: 'rating',
        label: 'Customer Rating'
    },
    {
        value: 'newest',
        label: 'Newest Arrivals'
    }
];
function CategoryPage({ params }) {
    _s();
    // Unwrap the params Promise using React.use()
    const unwrappedParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    const categorySlug = unwrappedParams.category;
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('featured');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CategoryPage.useEffect": ()=>{
            const fetchProductsByCategory = {
                "CategoryPage.useEffect.fetchProductsByCategory": async ()=>{
                    setLoading(true);
                    try {
                        // Use the Firebase utility to fetch products by category
                        const fetchedProducts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProductsByCategory"])(categorySlug);
                        setProducts(fetchedProducts);
                    } catch (error) {
                        console.error('Error fetching products by category:', error);
                    } finally{
                        setLoading(false);
                    }
                }
            }["CategoryPage.useEffect.fetchProductsByCategory"];
            if (categorySlug) {
                fetchProductsByCategory();
            }
        }
    }["CategoryPage.useEffect"], [
        categorySlug
    ]);
    // Apply sorting
    const sortedProducts = [
        ...products
    ].sort((a, b)=>{
        switch(sortBy){
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            default:
                // 'featured' - no additional sorting
                return 0;
        }
    });
    const displayName = categoryNames[categorySlug] || categorySlug;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: "text-indigo-600 hover:text-indigo-800 flex items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-5 h-5 mr-2",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            xmlns: "http://www.w3.org/2000/svg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        "Back to Home"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-gray-200 pb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-extrabold tracking-tight text-gray-900",
                        children: displayName
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-sm text-gray-500",
                        children: [
                            products.length,
                            " products"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pt-6 pb-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-medium text-gray-700",
                                children: "Filter by"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-gray-700 mr-2",
                                    children: "Sort by"
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: sortBy,
                                    onChange: (e)=>setSortBy(e.target.value),
                                    className: "block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
                                    children: sortOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: option.value,
                                            children: option.label
                                        }, option.value, false, {
                                            fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                                            lineNumber: 106,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                                    lineNumber: 100,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",
                children: [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6
                ].map((placeholder)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-pulse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-200 rounded-lg h-64 mb-4"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                                lineNumber: 119,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-4 bg-gray-200 rounded w-3/4 mb-2"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                                lineNumber: 120,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-4 bg-gray-200 rounded w-1/2"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                                lineNumber: 121,
                                columnNumber: 15
                            }, this)
                        ]
                    }, placeholder, true, {
                        fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                        lineNumber: 118,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                lineNumber: 116,
                columnNumber: 9
            }, this) : products.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "mx-auto h-12 w-12 text-gray-400",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        "aria-hidden": "true",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                            lineNumber: 134,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                        lineNumber: 127,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "mt-2 text-sm font-medium text-gray-900",
                        children: "No products found"
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-gray-500",
                        children: "We couldn't find any products in this category."
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                            children: "Browse All Products"
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                            lineNumber: 146,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                lineNumber: 126,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",
                children: sortedProducts.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        product: product
                    }, product.id, false, {
                        fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                        lineNumber: 157,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
                lineNumber: 155,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(main)/products/category/[category]/page.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
_s(CategoryPage, "6WpxLYhbKoiuBKbBhcqEBqLtaTU=");
_c = CategoryPage;
var _c;
__turbopack_context__.k.register(_c, "CategoryPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_9c73c127._.js.map