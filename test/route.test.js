import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import routes from '../src/router/paths'

const App = {
    template: `
      <router-link to="/health-check">healthcheck</router-link>
      <router-view />
    `
  }

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

test('routing', async () => {
  router.push('/health-check')

  // After this line, router is ready
  await router.isReady()

  const wrapper = mount(App, {
    global: {
      plugins: [router]
    }
  })
  expect(wrapper.html()).toContain('OK')
})