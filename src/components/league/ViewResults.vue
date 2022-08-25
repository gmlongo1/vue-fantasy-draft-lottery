<template>
  <v-container>
    <v-layout row>
      <v-col xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar class="secondary" extended>
            <v-toolbar-title slot="extension" class="white--text">{{ name }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-layout row>
                <v-col xs12>
                  <v-text-field
                      name="season"
                      label="Season"
                      id="season"
                      v-model="season"
                      disabled></v-text-field>
                </v-col>
              </v-layout>
              <v-layout row>
                <v-col xs12>
                  <v-text-field
                      name="owner"
                      label="Owner"
                      id="owner"
                      v-model="owner"
                      disabled></v-text-field>
                </v-col>
              </v-layout>
              <v-layout row>
                <v-col xs12>
                  <v-text-field
                      name="email"
                      label="Mail"
                      id="email"
                      v-model="email"
                      disabled></v-text-field>
                </v-col>
              </v-layout>
              <v-layout row>
                <v-col xs12>
                  <h3>Generated Draft Order</h3>
                </v-col>
              </v-layout>
              <v-layout row>
                <v-col xs12>
                  <v-list two-line subheader>
                    <transition-group name="list" tag="p">
                      <v-list-item v-for="team in teams" v-bind:key="team.name" class="list-item">
                        <v-list-item-avatar color="primary">
                          <span class="icon white--text">{{ team.draftOrder }}</span>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>{{ team.name }}</v-list-item-title>
                          <v-list-item-subtitle>{{ team.owner }} &lt;{{ team.email }}&gt;</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </transition-group>
                  </v-list>
                </v-col>
              </v-layout>
              <v-divider></v-divider>
              <v-layout row mt-2>
                <v-col xs6 text-xs-center>
                  <v-btn color="primary" @click="onCancel()">Cancel</v-btn>
                </v-col>
                <v-col xs12 s6 text-xs-center>
                  <v-btn class="red accent-4" dark @click="onEmailResults()">Email Results</v-btn>
                </v-col>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from 'firebase'

export default {
  data () {
    return {
      name: '',
      season: '',
      owner: '',
      email: '',
      teams: []
    }
  },
  mounted () {
    const user = this.$store.state.user
    const leagueRef = firebase.database().ref('/users/' + user.uid + '/leagues/' + this.$route.params.id)
    leagueRef.on('value',
      data => {
        this.name = data.val().name,
        this.season = data.val().season,
        this.owner = data.val().owner,
        this.email = data.val().email
      }
    )

    const teamsRef = firebase.database().ref('/users/' + user.uid + '/teams').orderByChild('leagueId').equalTo(this.$route.params.id)

    teamsRef.on('child_added',
      data => {
        const val = data.val()
        this.teams.push(
          {
            key: data.key,
            name: val.name,
            email: val.email,
            owner: val.owner,
            previousFinish: val.previousFinish,
            draftOrder: val.draftOrder
          }
        )
      }
    )

    this.teams.sort(
      (a, b) => {
        if (a.draftOrder < b.draftOrder) { return -1 }
        if (a.draftOrder > b.draftOrder) { return 1 }
        return 0
      }
    )
  },
  methods: {
    onCancel () {
      this.$router.push('/league/' + this.$route.params.id)
    },
    onEmailResults () {
    }
  }
}
</script>
