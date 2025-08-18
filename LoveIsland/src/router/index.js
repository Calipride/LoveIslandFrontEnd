import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const DiscoverView = () => import('@/views/DiscoverView.vue')
const MatchesView  = () => import('@/views/MatchesView.vue')
const ChatView     = () => import('@/views/ChatView.vue')
const ProfileView  = () => import('@/views/ProfileView.vue')
const AdminView    = () => import('@/views/AdminView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path:'/login',    name:'login',    component: LoginView,    meta:{ public:true } },
    { path:'/register', name:'register', component: RegisterView, meta:{ public:true } },

    { path:'/',         name:'discover', component: DiscoverView },
    { path:'/matches',  name:'matches',  component: MatchesView },
    { path:'/chat',     name:'chat',     component: ChatView },
    { path:'/profile',  name:'profile',  component: ProfileView },


    { path:'/admin',    name:'admin',    component: AdminView, meta:{ admin:true } },

    { path:'/:pathMatch(.*)*', redirect:'/' },
  ],
  scrollBehavior(){ return { top:0 } }
})

router.beforeEach((to) => {
  const u = useUserStore()
  if (to.meta.public) return
  if (!u.token) {
    return { name:'login', query:{ redirect: to.fullPath } }
  }
  if (to.meta.admin && !u.isAdmin) {
    return { name:'discover' }
  }
})

export default router
