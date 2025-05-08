# How to Fix the Params Promise Warning in Next.js 15

In Next.js 15, the `params` object is now a Promise that needs to be unwrapped with `React.use()` before accessing its properties.

## Steps to Fix

1. Open the file with the warning: `app/(main)/products/category/[category]/page.tsx`

2. Make these changes:

   ```diff
   - import { useState, useEffect } from 'react';
   + import { useState, useEffect, use } from 'react';
   ```

   Then find where params are accessed:

   ```diff
   export default function CategoryPage({ params }: { params: { category: string } }) {
   -  const { category } = params;
   +  // Unwrap the params Promise using React.use()
   +  const unwrappedParams = use(params);
   +  const category = unwrappedParams.category;
   ```

3. Make sure to update all instances of `category` if needed throughout the component.

## Why This Happens

In Next.js 15, route parameters (`params`) are now passed as a Promise to allow for data fetching during server rendering. The `use` function from React is designed to handle these Promises in a React-friendly way.

This change is part of Next.js' ongoing improvements to its data fetching and rendering model. 