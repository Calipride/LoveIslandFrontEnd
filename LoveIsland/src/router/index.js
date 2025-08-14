import { createRouter, createWebHistory } from 'vue-router'

const DiscoverView = () => import('../views/DiscoverView.vue')
const MatchesView  = () => import('../views/MatchesView.vue')
const ChatView     = () => import('../views/ChatView.vue')
const ProfileView  = () => import('../views/ProfileView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',           name: 'discover', component: DiscoverView },
    { path: '/matches',    name: 'matches',  component: MatchesView },
    { path: '/chat',       name: 'chat',     component: ChatView },
    { path: '/profile',    name: 'profile',  component: ProfileView },
  ],
  scrollBehavior(){ return { top: 0 } }
})

export default router
