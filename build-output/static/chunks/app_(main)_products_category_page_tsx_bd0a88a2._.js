(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/app/(main)/products/category/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>CategoriesPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebaseUtils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const categoryData = [
    {
        slug: 'electronics',
        name: 'Electronics',
        description: 'Latest gadgets and electronic devices',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop',
        color: 'from-blue-500 to-indigo-600',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-200'
    },
    {
        slug: 'clothing',
        name: 'Clothing',
        description: 'Stylish and comfortable apparel',
        image: 'https://images.unsplash.com/photo-1576571261645-c377cf8c7fce?q=80&w=2070&auto=format&fit=crop',
        color: 'from-green-500 to-teal-600',
        textColor: 'text-green-600',
        borderColor: 'border-green-200'
    },
    {
        slug: 'accessories',
        name: 'Accessories',
        description: 'Complete your look with our accessories',
        image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=2070&auto=format&fit=crop',
        color: 'from-yellow-500 to-amber-600',
        textColor: 'text-yellow-600',
        borderColor: 'border-yellow-200'
    },
    {
        slug: 'furniture',
        name: 'Furniture',
        description: 'Beautiful furniture for your home',
        image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=2070&auto=format&fit=crop',
        color: 'from-red-500 to-rose-600',
        textColor: 'text-red-600',
        borderColor: 'border-red-200'
    },
    {
        slug: 'home',
        name: 'Home & Garden',
        description: 'Make your living space beautiful',
        image: 'https://images.unsplash.com/photo-1564078516393-cf04bd966897?q=80&w=2069&auto=format&fit=crop',
        color: 'from-purple-500 to-violet-600',
        textColor: 'text-purple-600',
        borderColor: 'border-purple-200'
    },
    {
        slug: 'kitchen',
        name: 'Kitchen & Home',
        description: 'Quality kitchen tools and appliances',
        image: 'https://images.unsplash.com/photo-1590794056693-57dee373199f?q=80&w=2069&auto=format&fit=crop',
        color: 'from-cyan-500 to-sky-600',
        textColor: 'text-cyan-600',
        borderColor: 'border-cyan-200'
    }
];
function CategoriesPage() {
    _s();
    const [categoryStats, setCategoryStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CategoriesPage.useEffect": ()=>{
            const fetchCategoryStats = {
                "CategoriesPage.useEffect.fetchCategoryStats": async ()=>{
                    setLoading(true);
                    try {
                        // Fetch all products to calculate category counts
                        const products = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProducts"])();
                        // Count products in each category
                        const stats = {};
                        products.forEach({
                            "CategoriesPage.useEffect.fetchCategoryStats": (product)=>{
                                if (product.category) {
                                    stats[product.category] = (stats[product.category] || 0) + 1;
                                }
                            }
                        }["CategoriesPage.useEffect.fetchCategoryStats"]);
                        setCategoryStats(stats);
                    } catch (error) {
                        console.error('Error fetching products for category stats:', error);
                    } finally{
                        setLoading(false);
                    }
                }
            }["CategoriesPage.useEffect.fetchCategoryStats"];
            fetchCategoryStats();
        }
    }["CategoriesPage.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center mb-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl",
                        children: "Product Categories"
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/products/category/page.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-xl text-gray-500 max-w-2xl mx-auto",
                        children: "Browse our wide selection of products by category"
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/products/category/page.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/products/category/page.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
                children: categoryData.map((category, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.4,
                            delay: index * 0.1
                        },
                        className: `group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border ${category.borderColor}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative h-64 w-full overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: category.image,
                                        alt: category.name,
                                        fill: true,
                                        className: "object-cover transition-transform duration-500 group-hover:scale-110",
                                        priority: index < 2
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/products/category/page.tsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `absolute inset-0 bg-gradient-to-t ${category.color} opacity-30 group-hover:opacity-40 transition-opacity duration-300`
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/products/category/page.tsx",
                                        lineNumber: 125,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/products/category/page.tsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 bg-white",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: `text-2xl font-bold mb-2 ${category.textColor}`,
                                        children: category.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/products/category/page.tsx",
                                        lineNumber: 129,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-600 mb-4",
                                        children: category.description
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/products/category/page.tsx",
                                        lineNumber: 132,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-500",
                                                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "inline-block w-12 h-4 bg-gray-200 animate-pulse rounded"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(main)/products/category/page.tsx",
                                                    lineNumber: 138,
                                                    columnNumber: 21
                                                }, this) : `${categoryStats[category.slug] || 0} products`
                                            }, void 0, false, {
                                                fileName: "[project]/app/(main)/products/category/page.tsx",
                                                lineNumber: 136,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/products/category/${category.slug}`,
                                                className: `inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r ${category.color} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50`,
                                                children: [
                                                    "Explore",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "ml-2 -mr-1 w-4 h-4",
                                                        fill: "currentColor",
                                                        viewBox: "0 0 20 20",
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            fillRule: "evenodd",
                                                            d: "M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z",
                                                            clipRule: "evenodd"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(main)/products/category/page.tsx",
                                                            lineNumber: 149,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(main)/products/category/page.tsx",
                                                        lineNumber: 148,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(main)/products/category/page.tsx",
                                                lineNumber: 143,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(main)/products/category/page.tsx",
                                        lineNumber: 135,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/products/category/page.tsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, this)
                        ]
                    }, category.slug, true, {
                        fileName: "[project]/app/(main)/products/category/page.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/(main)/products/category/page.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-16 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/products",
                    className: "inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                    children: "View All Products"
                }, void 0, false, {
                    fileName: "[project]/app/(main)/products/category/page.tsx",
                    lineNumber: 159,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(main)/products/category/page.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(main)/products/category/page.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
_s(CategoriesPage, "0ObHyyol/v4I/NlIrnQO4WIkBMY=");
_c = CategoriesPage;
var _c;
__turbopack_context__.k.register(_c, "CategoriesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_%28main%29_products_category_page_tsx_bd0a88a2._.js.map