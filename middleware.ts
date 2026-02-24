import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/privacy",
  "/terms",
  "/data-security",
  "/acceptable-use",
  "/contact",
];

const PUBLIC_PREFIXES = [
  "/calculators",
  "/api/auth",
  "/_next",
  "/favicon",
];

const STATIC_EXTENSIONS = /\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2|ttf|eot)$/;

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Allow static files
  if (STATIC_EXTENSIONS.test(pathname)) {
    return NextResponse.next();
  }

  // Allow public prefixes
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow exact public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    // If logged in and visiting login/signup, redirect to portal
    if (session?.user && (pathname === "/login" || pathname === "/signup")) {
      return redirectToPortal(req, session);
    }
    return NextResponse.next();
  }

  // Onboarding is accessible to logged-in users who haven't completed it
  if (pathname === "/onboarding" || pathname.startsWith("/onboarding")) {
    if (!session?.user) {
      return redirectToLogin(req);
    }
    if (session.user.onboardingCompleted) {
      return redirectToPortal(req, session);
    }
    return NextResponse.next();
  }

  // Protected: /judges/*
  if (pathname.startsWith("/judges")) {
    if (!session?.user) return redirectToLogin(req);
    if (!session.user.onboardingCompleted) return redirectToOnboarding(req);
    if (session.user.role !== "judge") return redirectToPortal(req, session);
    return NextResponse.next();
  }

  // Protected: /lawyers/*
  if (pathname.startsWith("/lawyers")) {
    if (!session?.user) return redirectToLogin(req);
    if (!session.user.onboardingCompleted) return redirectToOnboarding(req);
    if (session.user.role !== "lawyer") return redirectToPortal(req, session);
    return NextResponse.next();
  }

  // Protected: /students/*
  if (pathname.startsWith("/students")) {
    if (!session?.user) return redirectToLogin(req);
    if (!session.user.onboardingCompleted) return redirectToOnboarding(req);
    if (session.user.role !== "law_student") return redirectToPortal(req, session);
    return NextResponse.next();
  }

  // Protected: /citizens/*
  if (pathname.startsWith("/citizens")) {
    if (!session?.user) return redirectToLogin(req);
    if (!session.user.onboardingCompleted) return redirectToOnboarding(req);
    if (session.user.role !== "common_person") return redirectToPortal(req, session);
    return NextResponse.next();
  }

  // Protected: /admin/*
  if (pathname.startsWith("/admin")) {
    if (!session?.user) return redirectToLogin(req);
    if (session.user.role !== "admin") return redirectToPortal(req, session);
    return NextResponse.next();
  }

  // Protected API routes
  if (pathname.startsWith("/api/brief") || pathname.startsWith("/api/research")) {
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Everything else: require auth
  if (!session?.user) {
    return redirectToLogin(req);
  }

  return NextResponse.next();
});

function redirectToLogin(req: any) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("callbackUrl", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

function redirectToOnboarding(req: any) {
  const url = req.nextUrl.clone();
  url.pathname = "/onboarding";
  return NextResponse.redirect(url);
}

function redirectToPortal(req: any, session: any) {
  const url = req.nextUrl.clone();
  const role = session.user.role;
  if (!session.user.onboardingCompleted) {
    url.pathname = "/onboarding";
  } else if (role === "judge") {
    url.pathname = "/judges";
  } else if (role === "lawyer") {
    url.pathname = "/lawyers";
  } else if (role === "law_student") {
    url.pathname = "/students";
  } else if (role === "common_person") {
    url.pathname = "/citizens";
  } else if (role === "admin") {
    url.pathname = "/admin";
  } else {
    url.pathname = "/onboarding";
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
