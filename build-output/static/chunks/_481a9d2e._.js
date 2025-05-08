(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/lib/firebase.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "app": (()=>firebaseApp),
    "auth": (()=>auth),
    "db": (()=>db),
    "storage": (()=>storage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm2017.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__p__as__getAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm2017/index-c92d61ad.js [app-client] (ecmascript) <export p as getAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$storage$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/storage/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/storage/dist/index.esm2017.js [app-client] (ecmascript)");
'use client';
;
;
;
;
// Function to check if the API key is potentially valid 
// Firebase API keys are typically formatted like AIzaSyB_Gf4aBcDeFgHiJkLmNoPqRsT_UvWxYz
const isValidApiKeyFormat = (key)=>{
    // Check if it's non-empty, has no quotes/commas, and starts with "AIza"
    if (!key || key.length < 10) return false;
    if (key.includes('"') || key.includes(',')) return false;
    return key.startsWith('AIza');
};
// Clean the API key - explicitly strip any quotes or commas
const cleanApiKey = ("TURBOPACK compile-time truthy", 1) ? ("TURBOPACK compile-time value", "AIzaSyBs3IxRtonXLuU4EgOQKqC_-c20-o2Wr_U").replace(/[",]/g, '') : ("TURBOPACK unreachable", undefined);
// Create safe instances with clearly defined types
let firebaseApp = null;
let db = null;
let auth = null;
let storage = null;
// Only initialize Firebase on the client side
if ("TURBOPACK compile-time truthy", 1) {
    try {
        // Firebase configuration
        const firebaseConfig = {
            apiKey: cleanApiKey,
            authDomain: ("TURBOPACK compile-time value", "luxoria-26023.firebaseapp.com"),
            projectId: ("TURBOPACK compile-time value", "luxoria-26023"),
            storageBucket: ("TURBOPACK compile-time value", "luxoria-26023.firebasestorage.app"),
            messagingSenderId: ("TURBOPACK compile-time value", "848502611944"),
            appId: ("TURBOPACK compile-time value", "1:848502611944:web:a7ba794cf595939be3ce5d"),
            measurementId: ("TURBOPACK compile-time value", "G-8M4YLL318J")
        };
        // Only initialize once
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApps"])().length) {
            // Validate API key before initializing
            if (!isValidApiKeyFormat(cleanApiKey)) {
                console.warn('Firebase API key format looks invalid or missing. Some features may not work.');
            }
            console.log('Initializing Firebase app...');
            firebaseApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeApp"])(firebaseConfig);
            // Initialize services
            db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(firebaseApp);
            auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__p__as__getAuth$3e$__["getAuth"])(firebaseApp);
            storage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStorage"])(firebaseApp);
            console.log('Firebase services initialized successfully');
        } else {
            console.log('Firebase already initialized, using existing instance');
            firebaseApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApps"])()[0];
            db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(firebaseApp);
            auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__p__as__getAuth$3e$__["getAuth"])(firebaseApp);
            storage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStorage"])(firebaseApp);
        }
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    // Keep the instances as null to indicate initialization failure
    }
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/authContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AuthProvider": (()=>AuthProvider),
    "useAuth": (()=>useAuth)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__z__as__onAuthStateChanged$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm2017/index-c92d61ad.js [app-client] (ecmascript) <export z as onAuthStateChanged>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ac__as__signInWithEmailAndPassword$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm2017/index-c92d61ad.js [app-client] (ecmascript) <export ac as signInWithEmailAndPassword>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ab__as__createUserWithEmailAndPassword$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm2017/index-c92d61ad.js [app-client] (ecmascript) <export ab as createUserWithEmailAndPassword>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__signOut$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm2017/index-c92d61ad.js [app-client] (ecmascript) <export D as signOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__al__as__updateProfile$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm2017/index-c92d61ad.js [app-client] (ecmascript) <export al as updateProfile>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cookies-next/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isAdmin, setIsAdmin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [auth, setAuth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Safely initialize auth on client side only
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // Prevent execution in SSR
            if ("TURBOPACK compile-time falsy", 0) {
                "TURBOPACK unreachable";
            }
            // Assign Firebase auth to state to ensure it's only used client-side
            if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]) {
                console.log('Firebase auth initialized successfully');
                setAuth(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]);
            } else {
                console.error('Firebase auth initialization failed');
                setError('Firebase authentication not available. Check your API key.');
            }
        }
    }["AuthProvider.useEffect"], []);
    // Fetch user role from Firestore
    const fetchUserRole = async (uid)=>{
        try {
            if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]) {
                const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', uid);
                const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(userRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const userIsAdmin = userData.role === 'admin';
                    setIsAdmin(userIsAdmin);
                    // Set or clear admin cookie based on role
                    if (userIsAdmin) {
                        // Check if cookie exists already to avoid unnecessary writes
                        const existingRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCookie"])('user_role');
                        if (existingRole !== 'admin') {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCookie"])('user_role', 'admin', {
                                maxAge: 30 * 24 * 60 * 60,
                                path: '/',
                                secure: ("TURBOPACK compile-time value", "development") === 'production',
                                sameSite: 'strict'
                            });
                            console.log('Admin cookie set for user:', uid);
                        }
                    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCookie"])('user_role') === 'admin') {
                        // If user has admin cookie but is not admin in DB, remove cookie
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCookie"])('user_role');
                    }
                } else {
                    console.log('No user document found, creating one');
                    // Create user document if it doesn't exist
                    const currentUser = auth?.currentUser;
                    if (currentUser) {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', currentUser.uid), {
                            uid: currentUser.uid,
                            email: currentUser.email,
                            displayName: currentUser.displayName || currentUser.email?.split('@')[0] || '',
                            photoURL: currentUser.photoURL,
                            role: 'user',
                            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                        });
                    }
                    setIsAdmin(false);
                    // Ensure no admin cookie exists
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCookie"])('user_role') === 'admin') {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCookie"])('user_role');
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
            setIsAdmin(false);
        }
    };
    // Listen for auth state changes after auth is initialized
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // Skip if auth is not initialized or we're in SSR
            if (!auth || "object" === 'undefined') return;
            setLoading(true);
            // Listen for auth state changes
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__z__as__onAuthStateChanged$3e$__["onAuthStateChanged"])(auth, {
                "AuthProvider.useEffect.unsubscribe": async (firebaseUser)=>{
                    if (firebaseUser) {
                        // User is signed in
                        try {
                            // Get the token and ensure auth_token cookie is set
                            const token = await firebaseUser.getIdToken(true);
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCookie"])('auth_token', token, {
                                maxAge: 30 * 24 * 60 * 60,
                                path: '/',
                                secure: ("TURBOPACK compile-time value", "development") === 'production',
                                sameSite: 'strict'
                            });
                            // Set user in state
                            const enhancedUser = {
                                ...firebaseUser,
                                isAdmin: false
                            };
                            setUser(enhancedUser);
                            // Fetch user role from Firestore and update state + cookies
                            await fetchUserRole(firebaseUser.uid);
                        } catch (error) {
                            console.error('Error in auth state change:', error);
                            // Still set the user but without admin privileges
                            const enhancedUser = {
                                ...firebaseUser,
                                isAdmin: false
                            };
                            setUser(enhancedUser);
                            setIsAdmin(false);
                        }
                    } else {
                        // User is signed out
                        setUser(null);
                        setIsAdmin(false);
                        // Clean up cookies
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCookie"])('auth_token');
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCookie"])('user_role');
                    }
                    setLoading(false);
                }
            }["AuthProvider.useEffect.unsubscribe"]);
            return ({
                "AuthProvider.useEffect": ()=>unsubscribe()
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        auth
    ]); // Depend on auth to re-run when auth is initialized
    const signIn = async (email, password)=>{
        setLoading(true);
        setError(null);
        try {
            if (!auth) {
                throw new Error('Firebase authentication is not initialized');
            }
            console.log('Authenticating user:', email);
            const userCredential = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ac__as__signInWithEmailAndPassword$3e$__["signInWithEmailAndPassword"])(auth, email, password);
            const firebaseUser = userCredential.user;
            // Set the user with default isAdmin value
            const enhancedUser = {
                ...firebaseUser,
                isAdmin: false
            };
            setUser(enhancedUser);
            // Get the token from Firebase
            const token = await firebaseUser.getIdToken(true);
            // Set auth cookie with the Firebase token
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCookie"])('auth_token', token, {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
                secure: ("TURBOPACK compile-time value", "development") === 'production',
                sameSite: 'strict'
            });
            // Fetch user role and update isAdmin state
            try {
                if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]) {
                    const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', firebaseUser.uid);
                    const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(userRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const userIsAdmin = userData.role === 'admin';
                        console.log('User role fetched:', {
                            uid: firebaseUser.uid,
                            role: userData.role,
                            isAdmin: userIsAdmin
                        });
                        // Update isAdmin state
                        setIsAdmin(userIsAdmin);
                        // Set user role cookie if user is admin
                        if (userIsAdmin) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCookie"])('user_role', 'admin', {
                                maxAge: 30 * 24 * 60 * 60,
                                path: '/',
                                secure: ("TURBOPACK compile-time value", "development") === 'production',
                                sameSite: 'strict'
                            });
                            console.log('Admin cookie set for user:', email);
                        } else {
                            // Ensure no admin cookie exists if not admin
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCookie"])('user_role');
                        }
                    } else {
                        console.log('No user document found, creating one');
                        // Create user document if it doesn't exist
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', firebaseUser.uid), {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
                            photoURL: firebaseUser.photoURL,
                            role: 'user',
                            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                        });
                        // Ensure no admin cookie exists
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCookie"])('user_role');
                    }
                }
            } catch (roleError) {
                console.error('Error fetching user role:', roleError);
                // Still keep the auth cookie even if there was an error getting the role
                setIsAdmin(false);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCookie"])('user_role');
            }
            console.log('User successfully signed in:', email);
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Failed to sign in';
            setError(mapAuthErrorToMessage(errorMessage));
            setUser(null);
            setIsAdmin(false);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCookie"])('auth_token');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCookie"])('user_role');
        } finally{
            setLoading(false);
        }
    };
    const signUp = async (email, password, name)=>{
        setLoading(true);
        setError(null);
        try {
            if (!auth) {
                throw new Error('Firebase authentication is not initialized');
            }
            // Create user with Firebase Authentication
            const userCredential = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ab__as__createUserWithEmailAndPassword$3e$__["createUserWithEmailAndPassword"])(auth, email, password);
            const firebaseUser = userCredential.user;
            // Update display name
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__al__as__updateProfile$3e$__["updateProfile"])(firebaseUser, {
                displayName: name
            });
            // Create user document in Firestore
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', firebaseUser.uid), {
                name: name,
                email: email,
                role: 'user',
                createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
                lastLogin: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
            // Set the user with default isAdmin value
            const enhancedUser = {
                ...firebaseUser,
                isAdmin: false
            };
            setUser(enhancedUser);
            // Set auth cookie
            const token = await firebaseUser.getIdToken();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCookie"])('auth_token', token, {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
                secure: ("TURBOPACK compile-time value", "development") === 'production',
                sameSite: 'strict'
            });
            console.log('User successfully registered:', email);
        } catch (err) {
            console.error('Registration error:', err);
            setError(mapAuthErrorToMessage(err instanceof Error ? err.message : String(err)));
            setUser(null);
            setIsAdmin(false);
        } finally{
            setLoading(false);
        }
    };
    const signOut = async ()=>{
        if (!auth) {
            setError('Authentication service is not available');
            return Promise.reject(new Error('Authentication service is not available'));
        }
        try {
            // Sign out from Firebase
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__signOut$3e$__["signOut"])(auth);
            // Clear all authentication cookies
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCookie"])('auth_token');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCookie"])('user_role');
            // Reset user state
            setUser(null);
            setIsAdmin(false);
            // Redirect to home page
            router.push('/');
            console.log('User signed out successfully');
        } catch (err) {
            console.error('Logout error:', err);
            const errorMessage = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Failed to sign out';
            setError(mapAuthErrorToMessage(errorMessage));
            throw err;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            loading,
            isAdmin,
            error,
            signIn,
            signUp,
            signOut
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/authContext.tsx",
        lineNumber: 344,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "t/z6wLjfSbvXYKLEd6srr+dKjCs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        console.warn('useAuth called outside of AuthProvider, using fallback implementation');
        // Return a fallback implementation
        return {
            user: null,
            loading: false,
            isAdmin: false,
            error: null,
            signIn: async ()=>{
                console.warn('Auth not available: signIn called outside AuthProvider');
            },
            signUp: async ()=>{
                console.warn('Auth not available: signUp called outside AuthProvider');
            },
            signOut: async ()=>{
                console.warn('Auth not available: signOut called outside AuthProvider');
            }
        };
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
// Helper function to map Firebase error codes to user-friendly messages
function mapAuthErrorToMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/user-not-found': 'Invalid email or password.',
        'auth/wrong-password': 'Invalid email or password.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/api-key-not-valid': 'Invalid API key. Please check your Firebase configuration.'
    };
    return errorMessages[errorCode] || `Unexpected error: ${errorCode}`;
}
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
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
"[project]/lib/firebaseUtils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "addProduct": (()=>addProduct),
    "clearAuthCookies": (()=>clearAuthCookies),
    "createOrder": (()=>createOrder),
    "deleteProduct": (()=>deleteProduct),
    "getCurrentUser": (()=>getCurrentUser),
    "getProductById": (()=>getProductById),
    "getProducts": (()=>getProducts),
    "getProductsByCategory": (()=>getProductsByCategory),
    "getUserOrders": (()=>getUserOrders),
    "setAuthCookies": (()=>setAuthCookies),
    "signIn": (()=>signIn),
    "signOut": (()=>signOut),
    "signUp": (()=>signUp),
    "transformFirebaseStorageUrl": (()=>transformFirebaseStorageUrl),
    "updateProduct": (()=>updateProduct),
    "uploadProductImage": (()=>uploadProductImage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ab__as__createUserWithEmailAndPassword$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm2017/index-c92d61ad.js [app-client] (ecmascript) <export ab as createUserWithEmailAndPassword>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ac__as__signInWithEmailAndPassword$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm2017/index-c92d61ad.js [app-client] (ecmascript) <export ac as signInWithEmailAndPassword>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__signOut$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm2017/index-c92d61ad.js [app-client] (ecmascript) <export D as signOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__z__as__onAuthStateChanged$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm2017/index-c92d61ad.js [app-client] (ecmascript) <export z as onAuthStateChanged>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$storage$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/storage/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/storage/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cookies-next/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseStorageHelper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebaseStorageHelper.ts [app-client] (ecmascript)");
;
;
;
;
;
;
// Check if we're using mock services (for development)
// Always use real Firebase unless explicitly set to use mocks
const shouldUseMockServices = ()=>{
    // Always prioritize the environment variable setting
    if ("TURBOPACK compile-time truthy", 1) {
        return false;
    }
    "TURBOPACK unreachable";
    // Fall back to mock only if auth is unavailable AND not explicitly set to false
    const authIsUnavailable = undefined;
};
// Also check if we're in the browser
const isBrowser = "object" !== 'undefined';
// Mock user for development
let mockUser = null;
const signUp = async (email, password)=>{
    try {
        // Check if we should use mock services
        if (shouldUseMockServices()) {
            console.log('Using mock signup service');
            // Simulate authentication delay
            await new Promise((resolve)=>setTimeout(resolve, 1000));
            // Create a mock user
            const mockUser = {
                uid: `mock-${Math.random().toString(36).substr(2, 9)}`,
                email,
                displayName: email.split('@')[0]
            };
            // Store in localStorage to simulate persistence
            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            // Also create a corresponding user document in the mock database
            if (!localStorage.getItem('mockDatabase')) {
                localStorage.setItem('mockDatabase', JSON.stringify({}));
            }
            const mockDb = JSON.parse(localStorage.getItem('mockDatabase') || '{}');
            if (!mockDb.users) {
                mockDb.users = {};
            }
            // Create a user document with default role
            mockDb.users[mockUser.uid] = {
                uid: mockUser.uid,
                email: mockUser.email,
                displayName: mockUser.displayName,
                role: 'user',
                createdAt: new Date().toISOString()
            };
            localStorage.setItem('mockDatabase', JSON.stringify(mockDb));
            setAuthCookies(mockUser);
            return mockUser;
        }
        // Use actual Firebase Auth
        const userCredential = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ab__as__createUserWithEmailAndPassword$3e$__["createUserWithEmailAndPassword"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], email, password);
        const user = userCredential.user;
        // Create a document in the users collection with the user's information
        if (user && __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]) {
            try {
                // Create a user document in Firestore
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', user.uid), {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || email.split('@')[0],
                    photoURL: user.photoURL,
                    role: 'user',
                    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                });
                console.log('User document created in Firestore');
            } catch (error) {
                console.error('Error creating user document:', error);
            // Consider whether to delete the auth user if Firestore creation fails
            // This depends on your requirements for data consistency
            }
        }
        setAuthCookies(user);
        return user;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
};
const setAuthCookies = (user)=>{
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    if (user) {
        // Set auth token cookie (in a real app, you would use a JWT or session token)
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCookie"])('auth_token', `mock-token-${user.uid}`, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            sameSite: 'strict'
        });
        // Set user role cookie if the user is an admin
        if (user.isAdmin) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCookie"])('user_role', 'admin', {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
                secure: ("TURBOPACK compile-time value", "development") === 'production',
                sameSite: 'strict'
            });
        }
    }
};
const clearAuthCookies = ()=>{
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCookie"])('auth_token');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cookies$2d$next$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteCookie"])('user_role');
};
const signIn = async (email, password)=>{
    const USE_MOCK_SERVICES = shouldUseMockServices();
    if (USE_MOCK_SERVICES || !isBrowser || !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]) {
        console.log('Mock signin with:', email);
        mockUser = {
            uid: 'mock-user-123',
            email: email,
            emailVerified: true,
            isAdmin: email.includes('admin')
        };
        // Set auth cookies for the mock user
        setAuthCookies({
            uid: mockUser.uid,
            email: mockUser.email || '',
            isAdmin: email.includes('admin')
        });
        return {
            user: mockUser
        };
    } else {
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ac__as__signInWithEmailAndPassword$3e$__["signInWithEmailAndPassword"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], email, password);
            // Set auth cookies for the real user
            const isAdmin = result.user.email?.includes('admin') || false;
            setAuthCookies({
                uid: result.user.uid,
                email: result.user.email || '',
                displayName: result.user.displayName || undefined,
                isAdmin
            });
            return result;
        } catch (error) {
            console.error('Firebase signin error:', error);
            // If Firebase auth fails, fall back to mock services
            console.log('Falling back to mock signin');
            mockUser = {
                uid: 'mock-user-123',
                email: email,
                emailVerified: true,
                isAdmin: email.includes('admin')
            };
            // Set auth cookies for the mock user
            setAuthCookies({
                uid: mockUser.uid,
                email: mockUser.email || '',
                isAdmin: email.includes('admin')
            });
            return {
                user: mockUser
            };
        }
    }
};
const signOut = async ()=>{
    const USE_MOCK_SERVICES = shouldUseMockServices();
    if (USE_MOCK_SERVICES || !isBrowser || !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]) {
        console.log('Mock signout');
        mockUser = null;
        // Clear auth cookies
        clearAuthCookies();
        return Promise.resolve();
    } else {
        try {
            // Clear auth cookies before Firebase sign out
            clearAuthCookies();
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__signOut$3e$__["signOut"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]);
        } catch (error) {
            console.error('Firebase signout error:', error);
            // Even if Firebase sign out fails, still clear the local user
            mockUser = null;
            return Promise.resolve();
        }
    }
};
const getCurrentUser = ()=>{
    const USE_MOCK_SERVICES = shouldUseMockServices();
    if (USE_MOCK_SERVICES || !isBrowser || !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]) {
        // In development, return the mock user
        return Promise.resolve(mockUser);
    } else {
        try {
            return new Promise((resolve)=>{
                const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__z__as__onAuthStateChanged$3e$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], (user)=>{
                    unsubscribe();
                    resolve(user);
                });
            });
        } catch (error) {
            console.error('Error getting current user:', error);
            return Promise.resolve(mockUser);
        }
    }
};
const getProducts = async ()=>{
    const USE_MOCK_SERVICES = shouldUseMockServices();
    if (USE_MOCK_SERVICES || !isBrowser || !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]) {
        console.warn('Using mock product data because Firebase is unavailable');
        // Check if we have mock products in localStorage
        try {
            if ("TURBOPACK compile-time truthy", 1) {
                const mockDb = JSON.parse(localStorage.getItem('mockDatabase') || '{}');
                if (mockDb.products && Array.isArray(mockDb.products)) {
                    console.log(`Retrieved ${mockDb.products.length} mock products from localStorage`);
                    return mockDb.products;
                }
            }
        } catch (error) {
            console.error('Error retrieving mock products:', error);
        }
        return []; // Return empty array if no mock products found
    } else {
        try {
            const productsCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'products');
            const productsSnapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(productsCollection);
            const productsList = productsSnapshot.docs.map((doc)=>{
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    price: data.price || 0,
                    createdAt: data.createdAt?.toDate?.() || new Date().toISOString()
                };
            });
            return productsList;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }
};
const getProductsByCategory = async (category)=>{
    const USE_MOCK_SERVICES = shouldUseMockServices();
    if (USE_MOCK_SERVICES || !isBrowser || !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]) {
        console.warn('Using mock product category data because Firebase is unavailable');
        // Check if we have mock products in localStorage
        try {
            if ("TURBOPACK compile-time truthy", 1) {
                const mockDb = JSON.parse(localStorage.getItem('mockDatabase') || '{}');
                if (mockDb.products && Array.isArray(mockDb.products)) {
                    // Filter products by category
                    const filtered = mockDb.products.filter((product)=>product.category === category);
                    console.log(`Retrieved ${filtered.length} mock products in category ${category}`);
                    return filtered;
                }
            }
        } catch (error) {
            console.error('Error retrieving mock products by category:', error);
        }
        return []; // Return empty array if no mock products found
    } else {
        try {
            const productsCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'products');
            const categoryQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(productsCollection, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('category', '==', category));
            const productsSnapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(categoryQuery);
            const productsList = productsSnapshot.docs.map((doc)=>{
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    price: data.price || 0,
                    createdAt: data.createdAt?.toDate?.() || new Date().toISOString()
                };
            });
            return productsList;
        } catch (error) {
            console.error('Error fetching products by category:', error);
            return [];
        }
    }
};
const getProductById = async (id)=>{
    const USE_MOCK_SERVICES = shouldUseMockServices();
    if (USE_MOCK_SERVICES || !isBrowser || !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]) {
        console.warn('Using mock product detail data because Firebase is unavailable');
        // Check if we have mock products in localStorage
        try {
            if ("TURBOPACK compile-time truthy", 1) {
                const mockDb = JSON.parse(localStorage.getItem('mockDatabase') || '{}');
                if (mockDb.products && Array.isArray(mockDb.products)) {
                    // Find product by ID
                    const product = mockDb.products.find((p)=>p.id === id);
                    if (product) {
                        console.log(`Retrieved mock product with ID: ${id}`);
                        return product;
                    }
                }
            }
        } catch (error) {
            console.error('Error retrieving mock product by ID:', error);
        }
        console.log('No product found with ID:', id);
        return null; // Return null if no mock product found
    } else {
        try {
            const productRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'products', id);
            const productSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(productRef);
            if (productSnap.exists()) {
                const data = productSnap.data();
                return {
                    id: productSnap.id,
                    ...data,
                    price: data.price || 0,
                    createdAt: data.createdAt?.toDate?.() || new Date().toISOString()
                };
            } else {
                console.log('No product found with ID:', id);
                return null;
            }
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            return null;
        }
    }
};
const addProduct = async (product)=>{
    const USE_MOCK_SERVICES = shouldUseMockServices();
    if (USE_MOCK_SERVICES || !isBrowser || !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]) {
        // Create a mock product ID
        const productId = `mock-product-${Date.now()}`;
        try {
            if ("TURBOPACK compile-time truthy", 1) {
                // Get existing database or initialize a new one
                const mockDb = JSON.parse(localStorage.getItem('mockDatabase') || '{}');
                // Initialize products array if it doesn't exist
                if (!mockDb.products) {
                    mockDb.products = [];
                }
                // Add new product with ID and createdAt
                const newProduct = {
                    ...product,
                    id: productId,
                    createdAt: new Date().toISOString()
                };
                // Add to mock database
                mockDb.products.push(newProduct);
                // Save back to localStorage
                localStorage.setItem('mockDatabase', JSON.stringify(mockDb));
                console.log('Adding mock product:', newProduct);
            }
        } catch (error) {
            console.error('Error storing mock product:', error);
        }
        return Promise.resolve(productId);
    } else {
        try {
            const productsCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'products');
            const docRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])(productsCollection, {
                ...product,
                createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding product to Firestore:', error);
            throw error;
        }
    }
};
const updateProduct = async (id, product)=>{
    const USE_MOCK_SERVICES = shouldUseMockServices();
    if (USE_MOCK_SERVICES || !isBrowser || !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]) {
        try {
            if ("TURBOPACK compile-time truthy", 1) {
                // Get existing database
                const mockDb = JSON.parse(localStorage.getItem('mockDatabase') || '{}');
                // Check if products array exists
                if (!mockDb.products || !Array.isArray(mockDb.products)) {
                    throw new Error('No products found in mock database');
                }
                // Find product index
                const productIndex = mockDb.products.findIndex((p)=>p.id === id);
                if (productIndex === -1) {
                    throw new Error(`Product with ID ${id} not found`);
                }
                // Update product
                mockDb.products[productIndex] = {
                    ...mockDb.products[productIndex],
                    ...product,
                    updatedAt: new Date().toISOString()
                };
                // Save back to localStorage
                localStorage.setItem('mockDatabase', JSON.stringify(mockDb));
                console.log('Updating mock product:', id, product);
            }
        } catch (error) {
            console.error('Error updating mock product:', error);
        }
        return Promise.resolve();
    } else {
        try {
            const productRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'products', id);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(productRef, {
                ...product,
                updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
        } catch (error) {
            console.error('Error updating product in Firestore:', error);
            throw error;
        }
    }
};
const deleteProduct = async (id)=>{
    const USE_MOCK_SERVICES = shouldUseMockServices();
    if (USE_MOCK_SERVICES || !isBrowser || !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]) {
        try {
            if ("TURBOPACK compile-time truthy", 1) {
                // Get existing database
                const mockDb = JSON.parse(localStorage.getItem('mockDatabase') || '{}');
                // Check if products array exists
                if (!mockDb.products || !Array.isArray(mockDb.products)) {
                    throw new Error('No products found in mock database');
                }
                // Filter out the product to delete
                mockDb.products = mockDb.products.filter((p)=>p.id !== id);
                // Save back to localStorage
                localStorage.setItem('mockDatabase', JSON.stringify(mockDb));
                console.log('Deleting mock product:', id);
            }
        } catch (error) {
            console.error('Error deleting mock product:', error);
        }
        return Promise.resolve();
    } else {
        try {
            const productRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'products', id);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])(productRef);
        } catch (error) {
            console.error('Error deleting product from Firestore:', error);
            throw error;
        }
    }
};
const getUserOrders = async (userId)=>{
    const USE_MOCK_SERVICES = shouldUseMockServices();
    if (USE_MOCK_SERVICES || !isBrowser || !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]) {
        // In development, return empty orders array
        console.log('Getting mock orders for user:', userId);
        return Promise.resolve([]);
    } else {
        try {
            const ordersCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'orders');
            const userOrdersQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(ordersCollection, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('userId', '==', userId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderBy"])('createdAt', 'desc'));
            const ordersSnapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(userOrdersQuery);
            const ordersList = ordersSnapshot.docs.map((doc)=>{
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate?.() || new Date().toISOString()
                };
            });
            return ordersList;
        } catch (error) {
            console.error('Error fetching user orders:', error);
            return [];
        }
    }
};
const createOrder = async (order)=>{
    const USE_MOCK_SERVICES = shouldUseMockServices();
    // In development, create a mock order ID
    console.log('Creating mock order:', order);
    return Promise.resolve(`mock-order-${Date.now()}`);
};
const uploadProductImage = async (file)=>{
    // Mock service for demo/development
    if (shouldUseMockServices()) {
        console.log('Using mock service for image upload:', file.name);
        // Simulate delay
        await new Promise((resolve)=>setTimeout(resolve, 1000));
        // Generate color for the SVG
        const getRandomColor = ()=>{
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
            return colors[Math.floor(Math.random() * colors.length)];
        };
        // Generate a simple SVG with the filename
        const color = getRandomColor();
        const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <rect width="600" height="400" fill="${color}" />
        <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="white">${file.name}</text>
      </svg>
    `;
        // Convert SVG to base64 data URL
        const base64Image = `data:image/svg+xml;base64,${btoa(svgContent.trim())}`;
        return Promise.resolve(base64Image);
    } else {
        try {
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"]) {
                throw new Error('Firebase storage is not initialized');
            }
            // Create a reference to the file in Firebase Storage
            // Remove special characters from filename to avoid URL encoding issues
            const safeFileName = file.name.replace(/[#?&\s]/g, '_');
            const storageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ref"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"], `product-images/${Date.now()}-${safeFileName}`);
            // Upload the file
            const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadBytes"])(storageRef, file);
            try {
                // Get the download URL
                const downloadURL = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDownloadURL"])(snapshot.ref);
                // Transform to direct download URL format to ensure CORS compatibility
                const directDownloadUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseStorageHelper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDirectDownloadUrl"])(downloadURL);
                console.log('Uploaded image URL:', {
                    original: downloadURL,
                    transformed: directDownloadUrl
                });
                return directDownloadUrl;
            } catch (urlError) {
                console.error('Error getting Firebase Storage download URL:', urlError);
                throw urlError;
            }
        } catch (error) {
            console.error('Error uploading image to Firebase Storage:', error);
            // Generate a fallback image with the filename
            const fileName = file.name || 'image';
            const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
          <rect width="600" height="400" fill="#4285F4" />
          <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="white">${fileName}</text>
        </svg>
      `;
            // Convert SVG to base64 data URL
            const base64Image = `data:image/svg+xml;base64,${btoa(svgContent.trim())}`;
            return base64Image;
        }
    }
};
const transformFirebaseStorageUrl = (url)=>{
    // Import and use the new utility for consistency
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseStorageHelper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDirectDownloadUrl"])(url);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/cartContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "CartProvider": (()=>CartProvider),
    "useCart": (()=>useCart)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebaseUtils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// Helper function to safely access localStorage
const safeLocalStorage = {
    getItem: (key)=>{
        if ("TURBOPACK compile-time falsy", 0) {
            "TURBOPACK unreachable";
        }
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error(`Error getting item ${key} from localStorage:`, error);
            return null;
        }
    },
    setItem: (key, value)=>{
        if ("TURBOPACK compile-time falsy", 0) {
            "TURBOPACK unreachable";
        }
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.error(`Error setting item ${key} in localStorage:`, error);
            return false;
        }
    }
};
const CartProvider = ({ children })=>{
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isInitialized, setIsInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Load cart from localStorage on mount - client-side only
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            // Use setTimeout to ensure this runs after hydration
            const timer = setTimeout({
                "CartProvider.useEffect.timer": ()=>{
                    try {
                        const savedCart = safeLocalStorage.getItem('cart');
                        if (savedCart) {
                            setItems(JSON.parse(savedCart));
                        }
                    } catch (error) {
                        console.error('Error loading cart from localStorage:', error);
                        setError('Failed to load your cart. Please refresh the page.');
                    } finally{
                        setIsInitialized(true);
                        setIsLoading(false);
                    }
                }
            }["CartProvider.useEffect.timer"], 0);
            return ({
                "CartProvider.useEffect": ()=>clearTimeout(timer)
            })["CartProvider.useEffect"];
        }
    }["CartProvider.useEffect"], []);
    // Save cart to localStorage whenever it changes - client-side only
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            if (!isInitialized) return;
            try {
                safeLocalStorage.setItem('cart', JSON.stringify(items));
            } catch (error) {
                console.error('Error saving cart to localStorage:', error);
                setError('Failed to save your cart. Changes may not persist.');
            }
        }
    }["CartProvider.useEffect"], [
        items,
        isInitialized
    ]);
    // Sync with Firebase when user logs in
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            if (!isInitialized) return;
            const syncCartWithFirebase = {
                "CartProvider.useEffect.syncCartWithFirebase": async ()=>{
                    try {
                        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebaseUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUser"])();
                        if (user) {
                            // In a real app, you would fetch the user's cart from Firestore
                            // and merge it with the local cart
                            console.log('User logged in, syncing cart with Firebase');
                        }
                    } catch (error) {
                        console.error('Error syncing cart with Firebase:', error);
                    // Don't set an error here as it's not critical for user experience
                    }
                }
            }["CartProvider.useEffect.syncCartWithFirebase"];
            syncCartWithFirebase();
        }
    }["CartProvider.useEffect"], [
        isInitialized
    ]);
    const addItem = (product, quantity = 1)=>{
        if (!product || !product.id) {
            console.error('Invalid product:', product);
            setError('Failed to add item to cart: Invalid product data');
            return;
        }
        setItems((prevItems)=>{
            try {
                // Check if item already exists in cart
                const existingItem = prevItems.find((item)=>item.productId === product.id);
                if (existingItem) {
                    // Update quantity if item exists
                    return prevItems.map((item)=>item.productId === product.id ? {
                            ...item,
                            quantity: item.quantity + quantity
                        } : item);
                } else {
                    // Add new item if it doesn't exist
                    return [
                        ...prevItems,
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.images[0],
                            quantity
                        }
                    ];
                }
            } catch (error) {
                console.error('Error adding item to cart:', error);
                setError('Failed to add item to cart. Please try again.');
                return prevItems;
            }
        });
    };
    const removeItem = (id)=>{
        try {
            setItems((prevItems)=>prevItems.filter((item)=>item.id !== id));
        } catch (error) {
            console.error('Error removing item from cart:', error);
            setError('Failed to remove item from cart. Please try again.');
        }
    };
    const updateQuantity = (id, quantity)=>{
        try {
            if (quantity <= 0) {
                removeItem(id);
                return;
            }
            setItems((prevItems)=>prevItems.map((item)=>item.id === id ? {
                        ...item,
                        quantity
                    } : item));
        } catch (error) {
            console.error('Error updating item quantity:', error);
            setError('Failed to update item quantity. Please try again.');
        }
    };
    const clearCart = ()=>{
        try {
            setItems([]);
        } catch (error) {
            console.error('Error clearing cart:', error);
            setError('Failed to clear your cart. Please try again.');
        }
    };
    const getTotalItems = ()=>{
        try {
            return items.reduce((total, item)=>total + item.quantity, 0);
        } catch (error) {
            console.error('Error calculating total items:', error);
            return 0;
        }
    };
    const getTotalPrice = ()=>{
        try {
            return items.reduce((total, item)=>total + item.price * item.quantity, 0);
        } catch (error) {
            console.error('Error calculating total price:', error);
            return 0;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            getTotalItems,
            getTotalPrice,
            isLoading,
            error
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/cartContext.tsx",
        lineNumber: 202,
        columnNumber: 5
    }, this);
};
_s(CartProvider, "/OEZQfojqohAeYIQoVjQbNxerds=");
_c = CartProvider;
const useCart = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (context === undefined) {
        console.warn('useCart called outside of CartProvider, using fallback implementation');
        // Return a fallback implementation
        return {
            items: [],
            addItem: ()=>console.warn('Cart not available'),
            removeItem: ()=>console.warn('Cart not available'),
            updateQuantity: ()=>console.warn('Cart not available'),
            clearCart: ()=>console.warn('Cart not available'),
            getTotalItems: ()=>0,
            getTotalPrice: ()=>0,
            isLoading: false,
            error: null
        };
    }
    return context;
};
_s1(useCart, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "CartProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/ClientProviders.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ClientProviders)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/authContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cartContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function ClientProviders({ children }) {
    _s();
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Only render providers after component is mounted on client
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ClientProviders.useEffect": ()=>{
            setIsMounted(true);
        }
    }["ClientProviders.useEffect"], []);
    // Don't render anything that uses client-side features until mounted
    if (!isMounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorBoundary, {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FallbackComponent, {}, void 0, false, {
            fileName: "[project]/components/ClientProviders.tsx",
            lineNumber: 23,
            columnNumber: 30
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartProvider"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
                        position: "top-right",
                        toastOptions: {
                            duration: 3000,
                            style: {
                                background: '#363636',
                                color: '#fff'
                            },
                            success: {
                                duration: 3000,
                                style: {
                                    background: '#4ade80',
                                    color: '#fff'
                                }
                            },
                            error: {
                                duration: 4000,
                                style: {
                                    background: '#ef4444',
                                    color: '#fff'
                                }
                            }
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/ClientProviders.tsx",
                        lineNumber: 26,
                        columnNumber: 11
                    }, this),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/components/ClientProviders.tsx",
                lineNumber: 25,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ClientProviders.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ClientProviders.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_s(ClientProviders, "h7njlszr1nxUzrk46zHyBTBrvgI=");
_c = ClientProviders;
// Simple error boundary component
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Component {
    state = {
        hasError: false,
        error: null
    };
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error("Error in client providers:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}
// Fallback UI when providers fail
function FallbackComponent() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-gray-50 px-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mt-6 text-3xl font-extrabold text-gray-900",
                        children: "Something went wrong"
                    }, void 0, false, {
                        fileName: "[project]/components/ClientProviders.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-sm text-gray-600",
                        children: "There was an error initializing the app. Please refresh the page."
                    }, void 0, false, {
                        fileName: "[project]/components/ClientProviders.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.location.reload(),
                        className: "mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none",
                        children: "Refresh Page"
                    }, void 0, false, {
                        fileName: "[project]/components/ClientProviders.tsx",
                        lineNumber: 91,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ClientProviders.tsx",
                lineNumber: 86,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ClientProviders.tsx",
            lineNumber: 85,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ClientProviders.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_c1 = FallbackComponent;
var _c, _c1;
__turbopack_context__.k.register(_c, "ClientProviders");
__turbopack_context__.k.register(_c1, "FallbackComponent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_481a9d2e._.js.map