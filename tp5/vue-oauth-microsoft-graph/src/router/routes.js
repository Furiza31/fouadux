import ConversationShowPage from '@/pages/ConversationShowPage.vue'
import ConversationsIndexPage from '@/pages/ConversationsIndexPage.vue'
import HomePage from '@/pages/HomePage.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: {
      auth: false
    }
  },
  {
    path: '/conversations',
    name: 'conversations',
    component: ConversationsIndexPage
  },
  {
    path: '/conversations/:id',
    name: 'conversation-show',
    component: ConversationShowPage
  }
]