# বাজার দর — চালানো ও submit করার ধাপ

## ১. Project খুলবে

ZIP download করে **Extract All** করবে। Extract হওয়া `BazarDor` folder VS Code-এ খুলবে। পুরো folder খুলবে; `.git`-এর file আলাদা করে খুলতে হবে না।

Terminal → New Terminal থেকে চালাবে:

```bash
npm install
```

Node.js 22.13 বা পরের version লাগবে।

## ২. Authentication-এর environment file

`.env.example` copy করে নাম দেবে `.env.local`।

Terminal-এ এই command দিয়ে নিজের secret তৈরি করো:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

ফলটি `.env.local`-এর `BETTER_AUTH_SECRET=`-এর পরে বসাবে।
`BETTER_AUTH_URL=http://localhost:3000` রাখবে। Local চালানোর জন্য Turso field খালি রাখতে পারবে।

```bash
npm run db:local
npm run dev
```

Browser-এ `http://localhost:3000` খুলবে। Sign Up করে নতুন account বানাবে, তারপর Sign In করবে। Verification email লাগে না।

## ৩. Google / GitHub login

দুটি button এবং BetterAuth integration দেওয়া আছে। চালু করার জন্য নিজের Google ও GitHub OAuth app-এর Client ID/Secret বসাতে হবে। কোনো shared বা fake credential নেই।

Callback URLs এবং environment keys-এর তালিকা README-তে আছে। Secret কখনো GitHub-এ upload করবে না।

## ৪. GitHub-এ project দেওয়া

ZIP-এর `.git` folder-এ কাজের commit history আছে। এটি delete করবে না। GitHub-এ নিজের একটি **empty repository** তৈরি করবে; নতুন repository-তে README/license/gitignore যোগ করবে না।

নিজের account-এর তথ্য বসিয়ে চালাবে:

```bash
git config user.name "YOUR_NAME"
git config user.email "YOUR_GITHUB_EMAIL"
git log --oneline
```

তারপর নিজের repository link ব্যবহার করবে:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

GitHub website থেকে শুধু file upload করলে পুরোনো commit history যাবে না; terminal থেকে push করবে।

## ৫. Vercel deploy

README-এর Vercel section অনুসরণ করবে। Vercel-এ account ও session স্থায়ী রাখতে **Turso database** ব্যবহার করবে; local.db upload করলে কাজ হবে না।

Turso URL/token স্থানীয় `.env.local`-এ বসিয়ে একবার চালাবে:

```bash
node --env-file=.env.local scripts/migrate-local.mjs
```

Vercel-এ একই database credentials, নতুন secret, production `BETTER_AUTH_URL` এবং Google/GitHub keys বসাবে। Callback URLs-ও production domain অনুযায়ী বদলাবে। তারপর redeploy করবে।

## ৬. Submit-এর আগে

- Mobile, tablet ও desktop-এ design দেখবে।
- Home-এর সব পণ্য button একই page-এ নিচে scroll করে কি না দেখবে।
- Category-এর তিনটি sorting option পরীক্ষা করবে।
- Login ছাড়া valid product details খুললে Sign In-এ যায় কি না দেখবে।
- Login-এর পরে product URL সরাসরি reload করবে।
- Profile → Update থেকে নাম বদলাবে; reload করে দেখবে।
- Google এবং GitHub login দুটিই বাস্তবে পরীক্ষা করবে।
- Invalid category/product/route-এ friendly 404 দেখাবে।
- Browser console-এ error আছে কি না দেখবে।
- শেষে README-তে নিজের live link এবং GitHub link বসিয়ে commit/push করবে।

Submit করবে নিজের **examiner-accessible live URL** এবং **GitHub repository URL**। দেওয়া ChatGPT preview owner-private; সেটি final public submission link হিসেবে ধরে নেবে না।
