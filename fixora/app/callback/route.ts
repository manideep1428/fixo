import { handleAuth } from '@workos-inc/authkit-nextjs';

// Redirect the user after successful sign in / callback processing
export const GET = handleAuth();
