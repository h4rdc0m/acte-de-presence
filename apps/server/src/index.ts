import { router } from '@stricjs/router';
import { dir, group } from '@stricjs/utils';

import routes from './routes';
import { cors } from './store/cors';

export default router(
    routes, 
    group(`${import.meta.dir}/pages`, {
        extensions: ['.html'],
        select: 'extensions',
        // Allow pages to be accessed outside
        headers: cors.headers,
    }),
)
// Serve all files in `public`
.all('/public/*', dir(`${import.meta.dir}/public`, {
    headers: cors.headers,
}))
.use(404);