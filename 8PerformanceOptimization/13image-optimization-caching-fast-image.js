/* =============================================================================
📘 Image Optimization in React Native – Caching, FastImage, Resizing
============================================================================= */

/*
🟢 Introduction
-----------------------------------------------------------------------------
- Images are one of the **biggest performance bottlenecks** in mobile apps.
- Poorly optimized images lead to:
  ❌ High memory usage
  ❌ Slow rendering
  ❌ Increased app startup time
  ❌ Network latency & high data usage
- React Native provides basic <Image>, but for advanced caching & performance, 
  libraries like **FastImage** are preferred.
*/

/* =============================================================================
🔹 1. Image Caching
-----------------------------------------------------------------------------
- Caching = Storing images locally after first load so they don’t need to be 
  fetched from the network again.

- React Native <Image>:
  - Only supports limited caching (iOS does better than Android).
  - Android caching is unreliable (images may reload often).

- Better option: **FastImage**
  ✅ Supports aggressive caching (both memory & disk).
  ✅ Handles priority-based loading.
  ✅ Works consistently across iOS & Android.

📌 Example – Using FastImage
---------------------------------
import FastImage from 'react-native-fast-image';

<FastImage
  style={{ width: 200, height: 200 }}
  source={{
    uri: 'https://example.com/image.jpg',
    priority: FastImage.priority.high,
    cache: FastImage.cacheControl.immutable,
  }}
  resizeMode={FastImage.resizeMode.cover}
/>

- cacheControl options:
  - immutable → Never changes, cache forever.
  - web → Use standard HTTP caching headers.
  - cacheOnly → Only load if already cached.
*/

/* =============================================================================
🔹 2. Image Resizing Strategies
-----------------------------------------------------------------------------
- Large images = high memory usage & slow load times.
- Always resize/compress images before displaying in the app.

✅ Strategies:
  - **Server-side resizing**: Deliver only required dimensions (best).
  - **Responsive scaling**: Use `Dimensions` or `useWindowDimensions` to 
    load different resolutions based on screen size.
  - **react-native-image-resizer** (or similar library) for local resizing.
  - Use `resizeMode` properly:
    - cover → Fill without distortion, may crop.
    - contain → Fit inside container, no crop.
    - stretch → Stretch to fit, may distort.
    - center → No resize, just center.

📌 Example – Resizing with Style
---------------------------------
<Image
  source={{ uri: 'https://example.com/big-image.png' }}
  style={{ width: 150, height: 150, resizeMode: 'contain' }}
/>
*/

/* =============================================================================
🔹 3. Best Practices for Image Optimization
-----------------------------------------------------------------------------
✅ Prefer **FastImage** over <Image> for caching & performance.
✅ Use **WebP/AVIF** format (smaller size, better compression).
✅ Preload frequently used images with `FastImage.preload`.
✅ Avoid inline base64 images (huge memory usage).
✅ Use thumbnails + lazy loading for large lists.
✅ Remove unused images from the bundle (bundle size reduction).
✅ Use **react-native-image-progress** or skeleton loaders for smooth UX.
✅ For icons → use vector (react-native-svg) instead of PNG/JPG.
*/

/* =============================================================================
🔹 4. Preloading & Priority Loading
-----------------------------------------------------------------------------
- Preload images to avoid delays when the screen loads.
- FastImage allows image preloading:

FastImage.preload([
  { uri: 'https://example.com/img1.png' },
  { uri: 'https://example.com/img2.png' },
]);

- Priority loading ensures critical images load first:
  - FastImage.priority.low
  - FastImage.priority.normal
  - FastImage.priority.high
*/

/* =============================================================================
🔹 5. Q&A (Interview Style)
-----------------------------------------------------------------------------
Q1: Why is <Image> not reliable for caching on Android?
   → Because React Native’s <Image> doesn’t have strong disk caching support 
     on Android, so images often reload.

Q2: How does FastImage improve performance?
   → Provides consistent caching, priority loading, and optimized memory usage.

Q3: What’s the best way to handle large images?
   → Resize on the server before sending to the app, or use a resizing library.

Q4: What image formats are best for optimization?
   → WebP or AVIF (smaller than PNG/JPG, with same quality).
*/

/* =============================================================================
✅ Final Takeaway
-----------------------------------------------------------------------------
- Use **FastImage** for caching & better control.
- Always resize/compress images before rendering.
- Preload critical assets for smooth UX.
- Optimize image formats & use vectors where possible.
============================================================================= */
