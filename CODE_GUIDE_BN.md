# Code কীভাবে কাজ করে

- `app/`-এর folder থেকে Next.js route তৈরি হয়। `[slug]` হলো বদলাতে পারে এমন route parameter।
- `components/navbar.tsx` session দেখে Sign In/Sign Up অথবা user menu দেখায়। Category active আছে কি না `usePathname()` দিয়ে বোঝে।
- `components/providers.tsx` API থেকে products ও categories আনে। Data আসার আগে loading=true থাকে, তাই skeleton দেখা যায়। Context থেকে অন্য component data পায়।
- `lib/catalog.ts` primary API চেষ্টা করে, তারপর alternative। দুটিই unavailable হলে তারিখসহ সংরক্ষিত JSON ব্যবহার হয়।
- `components/home-view.tsx` সব পণ্য দেখায়। `topMovers()` দিয়ে percentage অনুযায়ী সবচেয়ে বড় ছয়টি rise/fall বেছে নেয়।
- `components/category-view.tsx` category অনুযায়ী filter করে। Dropdown বদলালে `useState()` বদলায় এবং নতুন sorted cards দেখা যায়।
- `lib/format.ts` বাংলা সংখ্যা number-এ বদলায়। তাই ৩০, ৯৯, ১,৮৫০ সঠিক numerical order-এ sort হয়। মূল array পরিবর্তন করে না।
- `lib/auth.ts` BetterAuth-এর server configuration। Password/session database-এ BetterAuth পরিচালনা করে; browser localStorage-এ fake login flag রাখা হয় না।
- `lib/auth-client.ts` browser-এর signup, signin, signout, social login এবং updateUser-এর client।
- `app/product/[slug]/page.tsx` প্রথমে slug যাচাই করে। তারপর server-এ session check করে। Session না থাকলে Sign In route-এ redirect করে। UI লুকানোই একমাত্র protection নয়।
- `priceSummary()` সব market-এর minimum থেকে সর্বনিম্ন, maximum থেকে সর্বাধিক এবং market midpoint-এর average বের করে।
- `app/profile/update/` আলাদা protected route। `authClient.updateUser({ name })` দিয়ে নিজের নাম update হয়।
- `db/schema.ts`-এ user, session, account ও verification table declaration আছে। Verification table library schema-এর অংশ; email verification flow চালু করা হয়নি।
- `app/not-found.tsx` unknown route-এর friendly message। Invalid category/product-ও `notFound()` ব্যবহার করে।
- `app/globals.css` design, animation এবং responsive breakpoints রাখে। Tailwind-এর utility-ও ব্যবহার করা হয়েছে।

নিজে বুঝে পরীক্ষা করার ভালো উপায়: একটি category খুলে sort বদলাও, একটি account বানাও, login/logout করে protected page পরীক্ষা করো, তারপর profile-এর name update করে reload দাও।
