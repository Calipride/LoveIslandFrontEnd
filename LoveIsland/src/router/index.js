// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Eager import for login (fast), lazy-load the rest
import LoginView from '@/views/LoginView.vue'

const DiscoverView = () => import('@/views/DiscoverView.vue')
const MatchesView  = () => import('@/views/MatchesView.vue')
const ChatView     = () => import('@/views/ChatView.vue')
const ProfileView  = () => import('@/views/ProfileView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public
     { path: '/login', name: 'login', component: LoginView, meta: { public: true } },

    // Protected
    { path: '/',           name: 'discover', component: DiscoverView, meta: { requiresAuth: true } },
    { path: '/matches',    name: 'matches',  component: MatchesView,  meta: { requiresAuth: true } },
    // pass peer id to ChatView as a route param
    { path: '/chat/:peerId(\\d+)', name: 'chat', component: ChatView, props: true, meta: { requiresAuth: true } },
    { path: '/profile',    name: 'profile',  component: ProfileView,  meta: { requiresAuth: true } },

    // Redirect unknown routes
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(){ return { top: 0 } }
})

// Simple auth guard
router.beforeEach(async (to) => {
  const user = useUserStore()
  if (to.meta.requiresAuth && !user.isAuthed) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
