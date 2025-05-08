(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__de110ef0._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
;
// Configuration for protected routes (requiring authentication)
const protectedRoutes = [
    '/profile',
    '/orders',
    '/wishlist'
];
// Routes that allow guest checkout but could benefit from authentication
const guestCheckoutRoutes = [
    '/checkout'
];
// Admin-only routes (requiring admin privileges)
const adminRoutes = [
    '/dashboard',
    '/admin'
];
// Payment-related routes (requiring active checkout session)
const paymentRoutes = [
    '/checkout/success',
    '/checkout/payment'
];
function middleware(request) {
    // Get the path of the request
    const path = request.nextUrl.pathname;
    // Get auth and session cookies
    const authToken = request.cookies.get('auth_token')?.value;
    const userRole = request.cookies.get('user_role')?.value;
    const checkoutSessionId = request.cookies.get('checkout_session_id')?.value;
    // Function to check if the current path matches routes arrays
    const isProtectedRoute = protectedRoutes.some((route)=>path.startsWith(route));
    const isAdminRoute = adminRoutes.some((route)=>path.startsWith(route));
    const isPaymentRoute = paymentRoutes.some((route)=>path.startsWith(route));
    const isGuestCheckoutRoute = guestCheckoutRoutes.some((route)=>path.startsWith(route));
    // Build a properly encoded redirect URL with the original path for later redirect back
    const encodedRedirectPath = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
    const loginRedirectUrl = new URL(`/login?redirect=${encodedRedirectPath}`, request.url);
    // Handle authenticated routes
    if (isProtectedRoute && !authToken) {
        console.log(`Redirecting unauthenticated user from ${path} to login`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginRedirectUrl);
    }
    // Handle admin routes with strict permission check
    if (isAdminRoute) {
        // Check both authentication and admin role
        if (!authToken) {
            console.log(`Redirecting unauthenticated user from admin route ${path} to login`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginRedirectUrl);
        }
        if (userRole !== 'admin') {
            console.log(`Redirecting non-admin user from ${path} to home`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/', request.url));
        }
    }
    // Handle payment routes requiring active checkout session
    if (isPaymentRoute && !checkoutSessionId) {
        console.log(`Redirecting user from payment route ${path} to checkout`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/checkout', request.url));
    }
    // Additional security headers for all responses
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    // Set common security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    return response;
}
const config = {
    matcher: [
        '/profile/:path*',
        '/orders/:path*',
        '/dashboard/:path*',
        '/admin/:path*',
        '/checkout/:path*',
        '/wishlist/:path*'
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__de110ef0._.js.map