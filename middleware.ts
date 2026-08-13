export { auth as middleware } from '@/lib/auth'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|background|play2learn|login|register|welcome).*)'],
}
