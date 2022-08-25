<template>
  <v-container mt-0>
    <v-layout row>
      <v-col xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar class="secondary" extended>
            <v-toolbar-title slot="extension" class="white--text">Create League</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-form v-model="formValid">
                <v-layout row>
                  <v-col xs12>
                    <v-text-field
                      name="season"
                      label="Season"
                      id="season"
                      v-model="season"
                      v-bind:rules="seasonRules"
                      required></v-text-field>
                  </v-col>
                </v-layout>
                <v-layout row>
                  <v-col xs12>
                    <v-text-field
                      name="name"
                      label="Name"
                      id="name"
                      v-model="name"
                      v-bind:rules="nameRules"
                      required></v-text-field>
                  </v-col>
                </v-layout>
                <v-layout row>
                  <v-col xs12>
                    <v-text-field
                      name="owner"
                      label="Owner"
                      id="owner"
                      v-model="owner"
                      v-bind:rules="ownerRules"
                      required></v-text-field>
                  </v-col>
                </v-layout>
                <v-layout row>
                  <v-col xs12>
                    <v-text-field
                      name="email"
                      label="Mail"
                      id="email"
                      v-model="email"
                      type="email"
                      v-bind:rules="emailRules"
                      required></v-text-field>
                  </v-col>
                </v-layout>
                <v-layout row mt-3>
                  <v-col xs12>
                    <v-btn router to="/leagues" class="mr-4">Cancel</v-btn>
                    <v-btn color="primary" @click="onCreateLeague()" :disabled="!formValid" primary>Create</v-btn>
                  </v-col>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-layout>
    <v-snackbar
      :top="snackbarLocationTop"
      v-model="snackbar"
      :color="snackbarColor">
      {{ snackbarText }}
      <v-btn dark @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import firebase from 'firebase'

export default {
  data () {
    return {
      formValid: false,
      season: '',
      seasonRules: [
        (v) => !!v || 'Season is required'
      ],
      name: '',
      nameRules: [
        (v) => !!v || 'Name is required'
      ],
      owner: '',
      ownerRules: [
        (v) => !!v || 'Owner is required'
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      snackbar: false,
      snackbarColor: '',
      snackbarText: '',
      snackbarLocationTop: true
    }
  },

  methods: {
    onCreateLeague () {
      const data = {
        season: this.season,
        name: this.name,
        owner: this.owner,
        email: this.email
      }

      // add league
      const user = this.$store.state.user
      const leagueKey = firebase.database().ref('/users/' + user.uid + '/leagues').push(data).key

      // show leagues component
      this.$router.push('/leagues')
    }
  }
}
</script>
