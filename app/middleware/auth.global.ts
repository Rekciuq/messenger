const PUBLIC_ROUTES = ['/login', '/signup'];

export default defineNuxtRouteMiddleware(async (to) => {
    if (!import.meta.client) {
        return;
    }

    const isPublicRoute = PUBLIC_ROUTES.includes(to.path);
    
    try {
        const response = await $fetch('/api/v1/auth/session', {
            method: 'GET',
        });
        
        const isAuthenticated = response && response.success;
        
        if (isAuthenticated && isPublicRoute) {
            return navigateTo('/');
        }
        
        if (!isAuthenticated && !isPublicRoute) {
            return navigateTo('/login');
        }
    } catch {
        if (!isPublicRoute) {
            return navigateTo('/login');
        }
    }
});

