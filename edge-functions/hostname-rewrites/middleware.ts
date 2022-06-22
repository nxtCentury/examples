import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/', '/about'],
}

export default function middleware(req: NextRequest) {
  // Create a new URL object from the request URL
  const url = new URL(req.nextUrl)

  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const hostname = req.headers.get('host')

  // If localhost, assign the host value manually
  // If prod, get the custom domain/subdomain value by removing the root URL
  // (in the case of "test.vercel.app", "vercel.app" is the root URL)
  const currentHost =
    process.env.NODE_ENV == 'production'
      ? hostname.replace(`.${process.env.ROOT_URL}`, '')
      : process.env.CURR_HOST

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents. This can also be done
  // via rewrites to a custom 404 page
  if (url.pathname.startsWith(`/_sites`)) {
    url.pathname = `/404`
  } else {
    // rewrite to the current hostname under the pages/sites folder
    // the main logic component will happen in pages/sites/[site]/index.tsx
    url.pathname = `/_sites/${currentHost}${url.pathname}`
  }

  // Rewrite to the url
  return NextResponse.rewrite(url)
}