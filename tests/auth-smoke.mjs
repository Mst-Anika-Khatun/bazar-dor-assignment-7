// Run against a local production Next.js server. It creates a throwaway test account.
import assert from "node:assert/strict";

const origin = process.env.TEST_ORIGIN || "http://localhost:3000";
const email = `check-${Date.now()}@example.invalid`;
let cookie = "";
async function request(path, body, authenticated = false) {
  const response = await fetch(origin + path, {
    method: body ? "POST" : "GET", redirect: "manual",
    headers: { Origin: origin, ...(body ? { "Content-Type": "application/json" } : {}), ...(authenticated ? { Cookie: cookie } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return response;
}
let checks = 0;
function check(condition, message) { assert.ok(condition, message); checks++; console.log(`PASS ${message}`); }

check((await request("/missing-page")).status === 404, "unknown route returns 404");
check((await request("/category/invalid")).status === 404, "invalid category returns 404");
check((await request("/product/unknown")).status === 404, "unknown product returns 404 before login");
const protectedResponse = await request("/product/miniket-chal");
check([307, 308].includes(protectedResponse.status) && protectedResponse.headers.get("location")?.includes("/signin"), "anonymous details redirects to signin");
check([307, 308].includes((await request("/profile")).status), "anonymous profile is protected");
check((await request("/category/chal")).status === 200, "category opens directly on refresh");
check((await request("/api/auth/sign-up/email", { name: "Test", email, password: "short" })).status === 400, "short password is rejected by server");
const signup = await request("/api/auth/sign-up/email", { name: "Test User", email, password: "BazarTest!1234" });
check(signup.status === 200, "email signup succeeds without verification");
check((await signup.json()).token === null, "signup does not automatically sign in");
check((await request("/api/auth/sign-in/email", { email, password: "WrongPass1234" })).status === 401, "wrong password is rejected");
const signin = await request("/api/auth/sign-in/email", { email, password: "BazarTest!1234" });
check(signin.status === 200, "email signin succeeds");
cookie = signin.headers.getSetCookie().map(value => value.split(";")[0]).join("; ");
const session = await (await request("/api/auth/get-session", undefined, true)).json();
check(session.user.email === email, "session cookie identifies signed-in user");
const detail = await request("/product/miniket-chal", undefined, true);
check(detail.status === 200 && (await detail.text()).includes("কারওয়ান বাজার"), "authenticated product refresh includes market data");
check((await request("/api/auth/update-user", { name: "Updated Test User" }, true)).status === 200, "BetterAuth updates profile name");
const updated = await (await request("/api/auth/get-session", undefined, true)).json();
check(updated.user.name === "Updated Test User", "updated name persists in session/database");
const profile = await request("/profile", undefined, true);
check(profile.status === 200 && (await profile.text()).includes("Updated Test User"), "profile refresh displays updated name");
check((await request("/profile/update", undefined, true)).status === 200, "separate profile-update route loads");
check((await request("/api/auth/sign-out", {}, true)).status === 200, "logout succeeds");
check(await (await request("/api/auth/get-session", undefined, true)).json() === null, "logout invalidates stored session");
check([307, 308].includes((await request("/product/miniket-chal", undefined, true)).status), "old cookie cannot access details after logout");
console.log(`${checks} production HTTP checks passed.`);
