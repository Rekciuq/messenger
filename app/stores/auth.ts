import { DateTime } from 'luxon';
import { defineStore } from 'pinia';
import { formatTime } from '~/utils/chats/formatTime';

export interface SessionData {
    id: string;
    email: string;
    userName: string;
    bio?: string;
    profilePictureUrl: string;
    lastSeen: Date;
    isOnline: boolean;
}

interface AuthState {
    session: SessionData | null;
    isLoading: boolean;
    isInitialized: boolean;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        session: null,
        isLoading: false,
        isInitialized: false,
    }),

    getters: {
        isAuthenticated: (state) => state.session !== null,
        userEmail: (state) => state.session?.email || '',
        userName: (state) => state.session?.userName || '',
        userProfilePicture: (state) => state.session?.profilePictureUrl || '',
        lastSeen: (state) => formatTime(state.session?.lastSeen.toString() || ''),
        isOnline: (state) => {
            if (!state.session?.lastSeen) return true;
            const lastSeen = DateTime.fromISO(state.session.lastSeen.toString());
            const now = DateTime.now();
            const diff = now.diff(lastSeen, ['minutes']);
            return diff.minutes < 3; // 3 minutes
        },
    },

    actions: {
        async fetchSession() {
            if (this.isLoading) return;
            
            this.isLoading = true;
            try {
                const response = await $fetch('/api/v1/auth/session');
                
                if (response.success && response.data) {
                    this.session = response.data;
                } else {
                    this.session = null;
                }
            } catch (error) {
                console.error('Failed to fetch session:', error);
                this.session = null;
            } finally {
                this.isLoading = false;
                this.isInitialized = true;
            }
        },

        async initialize() {
            if (this.isInitialized) return;
            await this.fetchSession();
        },
        async updateOnlineStatus(isOnline: boolean) {
            if (!this.session) return;
            this.session.isOnline = isOnline;
            $fetch('/api/v1/auth/update-online-status', {
                method: 'POST',
                body: {
                    isOnline: isOnline,
                },
            });
        },

        clearSession() {
            this.session = null;
            this.isInitialized = false;
        },
    },
});

