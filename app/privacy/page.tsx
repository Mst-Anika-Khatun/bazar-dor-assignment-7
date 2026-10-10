import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | BazarDor",
  description: "How BazarDor uses and stores account information.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <article className="space-y-8 rounded-2xl border border-green-100 bg-white p-6 text-gray-700 sm:p-10">
        <header>
          <h1 className="text-3xl font-bold text-green-800">
            BazarDor Privacy Policy
          </h1>
          <p className="mt-3">Last updated: October 10, 2026</p>
          <p className="mt-4">
            BazarDor is an educational project for viewing everyday
            product prices and comparing prices across markets.
          </p>
        </header>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Information we collect
          </h2>
          <p>
            When you register, we store your name, email address and
            a hashed password. When you sign in with Google or GitHub,
            we receive basic profile information such as your name,
            email address, profile image and provider account identifier.
            Your Google or GitHub password is not provided to BazarDor.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            How we use your information
          </h2>
          <p>
            We use account information to authenticate you, display
            your profile, allow name updates and provide access to
            protected product detail pages. Google user data is used
            for account and sign-in features.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Cookies and storage
          </h2>
          <p>
            We use session cookies to keep you signed in. Account and
            session records are stored in our Turso database. The
            application is hosted on Vercel. Authentication records
            may include provider tokens and session information needed
            to operate these features.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Sharing and service providers
          </h2>
          <p>
            We do not sell your account information or use Google user
            data for advertising. Our hosting, database and sign-in
            providers process information as needed to operate the
            service. Their own privacy policies also apply to their
            services.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Your choices and data retention
          </h2>
          <p>
            You can update your name from your profile and sign out
            at any time. Account information is retained until it is
            deleted or the project is discontinued. To request account
            deletion or ask about your information, contact us using
            the email below. You can also revoke BazarDor access from
            your Google or GitHub account settings.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Contact
          </h2>
          <a
            href="mailto:relatedwork508@gmail.com"
            className="break-all text-green-700 underline"
          >
            relatedwork508@gmail.com
          </a>
        </section>

        <Link
          href="/"
          className="inline-block rounded-lg bg-green-700 px-5 py-3 text-white"
        >
          হোম পেজে ফিরে যান
        </Link>
      </article>
    </main>
  );
}