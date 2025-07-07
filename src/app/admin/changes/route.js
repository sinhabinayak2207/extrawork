// This file ensures the admin/changes route is included in the static export
export const dynamic = 'force-static';

export async function GET() {
  return new Response(null, {
    status: 307,
    headers: {
      Location: '/admin/changes',
    },
  });
}
