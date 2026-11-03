import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Ververst de Supabase-sessie bij elk verzoek en beschermt /beheer en /mijn.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(toSet) {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const beschermd = ['/beheer', '/mijn', '/aan-de-slag', '/welkom', '/start'];
  if (!user && beschermd.some((p) => path.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('volgende', path);
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ['/beheer/:path*', '/mijn/:path*', '/start', '/login', '/aan-de-slag', '/welkom'],
};
