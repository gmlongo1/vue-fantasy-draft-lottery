<template>
  <v-container mt-0>
    <v-layout row>
      <v-col xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar class="secondary">
            <v-toolbar-title class="white--text">Update Team</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-form v-model="formValid">
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
                    <v-btn flat @click="onCancel()" class="mr-4">Cancel</v-btn>
                    <v-btn class="primary" @click="onUpdateTeam()" :disabled="!formValid" :loading="loading" primary>Update</v-btn>
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
      <v-btn flat dark @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import firebase from 'firebase'

export default {
  data () {
    return {
      loading: false,
      formValid: false,
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
      leagueId: '',
      previousFinish: '',
      snackbar: false,
      snackbarColor: '',
      snackbarText: '',
      snackbarLocationTop: true
    }
  },
  created () {
    const user = this.$store.state.user
    const teamRef = firebase.database().ref('/users/' + user.uid + '/teams/' + this.$route.params.id)
    teamRef.on('value',
      data => {
        this.name = data.val().name,
        this.owner = data.val().owner,
        this.email = data.val().email,
        this.previousFinish = data.val().previousFinish,
        this.leagueId = data.val().leagueId
      }
    )
  },
  methods: {
    onCancel () {
      this.$router.push('/league/' + this.leagueId + '/teams')
    },
    onUpdateTeam () {
      this.loading = true

      const data = {
        name: this.name,
        owner: this.owner,
        email: this.email,
        previousFinish: this.previousFinish,
        leagueId: this.leagueId
      }

      // update team data
      const user = this.$store.state.user
      firebase.database().ref('/users/' + user.uid + '/teams/' + this.$route.params.id)
        .set(data)
        .then(
          data => {
            this.loading = false
            this.$router.push('/league/' + this.leagueId + '/teams')
          }
        )
        .catch(
          err => {
            this.snackbar = true
            this.snackbarColor = 'error'
            this.snackbarText = err.message
          }
        )
    }
  }
}
</script>
