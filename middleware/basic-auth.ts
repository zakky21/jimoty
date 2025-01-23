import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from 'next/server';

export function basicAuth(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const authHeader = request.headers.get('Authorization');
    const { BASIC_AUTH_USER, BASIC_AUTH_PASSWORD } = process.env;

    if (!BASIC_AUTH_USER) return middleware(request, event);

    if (authHeader) {
      const authValue = authHeader.split(' ')[1];
      // atob is deprecated but Buffer.from is not available in Next.js edge.
      const [user, password] = atob(authValue).split(':');

      if (user === BASIC_AUTH_USER && password === BASIC_AUTH_PASSWORD) {
        return middleware(request, event);
      }
    }

    return NextResponse.json(
      { error: 'Please enter credentials' },
      { headers: { 'WWW-Authenticate': 'Basic realm="Enter ID/PW"' }, status: 401 },
    );
  };
}
