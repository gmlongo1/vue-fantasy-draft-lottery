<template>
  <v-app>
    <v-toolbar class="primary flex-grow-0 fixed-toolbar" dark>
      <v-app-bar-nav-icon
        @click.stop="sideNav = !sideNav"
        class="hidden-md-and-up"></v-app-bar-nav-icon>
      <v-toolbar-title class="pl-0">
        <v-row justify="center" align="center">
          <v-col>
            <v-img src="./assets/fdl logo small.svg" max-height="49" max-width="50"></v-img>
          </v-col>
          <v-col>
            <router-link to="/" tag="span" style="cursor:pointer; font-family: 'verdana'"><span>Fantasy</span><span style="color: #004ba0">Draft</span><span>Lottery</span></router-link>
          </v-col>
        </v-row>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down mr-0" >
        <v-btn v-for="item in menuItems"
          router
          :to="item.link"
          :key="item.title">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn v-if="user != null && user.photoURL != null"
          router
          to="/profile">
          <v-avatar>
              <img :src="user.photoURL" alt="">
          </v-avatar>
        </v-btn>
        <v-btn v-else-if="user"
          router
          to="/profile">
          <v-icon>account_circle</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer v-model="sideNav" temporary absolute>
      <v-toolbar class="transparent">
        <v-list class="pa-0" v-if="user != null">
          <v-list-item router to="/profile">
            <v-list-item-avatar>
              <img v-if="user.photoURL" :src="user.photoURL" />
              <v-icon v-else>account_circle</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ user.displayName ?  user.displayName : user.email }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-toolbar>
      <v-list>
        <v-divider></v-divider>
        <v-list-item
          v-for="item in menuItems"
          v-bind:key="item.title"
          router
          v-bind:to="item.link">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <main class="mb-12">
      <router-view></router-view>
    </main>

    <v-footer class="pa-3" bottom app>
      <v-spacer></v-spacer>
      <div>?? Fantasy Draft Lottery {{ new Date().getFullYear() }}</div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      sideNav: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    menuItems () {
      if (this.$store.state.user != null) {
        return [
          { icon: 'list', title: 'View Leagues', link: '/leagues' },
          { icon: 'playlist_add', title: 'Create League', link: '/league/new' }
        ]
      } else {
        return [
          { icon: 'face', title: 'Sign Up', link: '/signup' },
          { icon: 'lock_open', title: 'Sign In', link: '/signin' }
        ]
      }
    }
  }
}
</script>
