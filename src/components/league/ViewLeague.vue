<template>
  <v-container>
    <v-layout row>
      <v-col xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar class="secondary">
            <v-toolbar-title slot="extension" class="white--text">
              {{ name }}
            </v-toolbar-title>
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
                    <v-select
                      v-bind:items="typeItems"
                      v-model="lotteryType"
                      label="Lottery Type"
                      single-line
                      bottom
                      disabled></v-select>
                  </v-col>
                </v-layout>
              <v-layout row class="mt-0">
                <v-col xs12 text-xs-right>
                  <v-btn outlined class="no-border" color="primary" @click="onEditLeague()"><v-icon left>mdi-pencil</v-icon>Edit</v-btn>
                </v-col>
              </v-layout>
              <v-layout row mt-5 mb-5>
                <v-divider></v-divider>
              </v-layout>
              <v-layout row mt-3>
                <v-col xs12>
                  <h3>Teams (in order of previous finish)</span></h3>
                </v-col>
              </v-layout>
              <v-layout row>
                <v-col xs12>
                  <v-list two-line subheader>
                    <v-list-item v-for="(team, index) in teams" v-bind:key="team.name">
                      <v-list-item-avatar :color="colors[index]">
                        <span class="icon white--text">{{ team.previousFinish }}</span>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{ team.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ team.owner }} &lt;{{ team.email }} &gt;</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-layout>
              <v-layout row class="mt-0">
                <v-col>
                  <v-btn outlined class="no-border" color="primary" @click="onEditTeams()"><v-icon left>mdi-pencil</v-icon>Edit</v-btn>
                </v-col>
              </v-layout>
              <v-layout row mt-5 mb-5>
                <v-divider></v-divider>
              </v-layout>
              <v-layout row justify-center>
                <v-col>
                  <v-btn router to="/leagues" class="mr-4">Cancel</v-btn>
                  <v-btn class="red accent-4" dark @click="onGenerateOrder()">Generate Order</v-btn>
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
      season: '',
      name: '',
      owner: '',
      email: '',
      lotteryType: '',
      typeItems: [
        { text: 'Straight - Each team gets one ball', value: 'S' },
        { text: 'Weighted - Number of balls per team = previous finish', value: 'W' },
        { text: 'Heavily Weighted - Number of balls per team = previous finish squared', value: 'H' }
      ],
      teams: [],
      colors
    }
  },
  created () {
    const user = this.$store.state.user
    const leagueRef = firebase.database().ref('/users/' + user.uid + '/leagues/' + this.$route.params.id)
    leagueRef.on('value',
      data => {
        this.season = data.val().season,
        this.name = data.val().name,
        this.owner = data.val().owner,
        this.email = data.val().email,
        this.lotteryType = data.val().lotteryType
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
            previousFinish: val.previousFinish
          }
        )
      }
    )

    // use the "value" callback to signify that all data has been retrieved so we can now sort
    teamsRef.on('value',
      data => {
        this.teams.sort(
          (a, b) => {
            if (a.previousFinish < b.previousFinish) { return -1 }
            if (a.previousFinish > b.previousFinish) { return 1 }
            return 0
          }
        )
      }
    )
  },
  methods: {
    onEditLeague (league) {
      this.$router.push('/league/' + this.$route.params.id + '/edit')
    },
    onEditTeams (league) {
      this.$router.push('/league/' + this.$route.params.id + '/teams')
    },
    onGenerateOrder () {
      const user = this.$store.state.user

      const pool = []
      for (let i = 0; i < this.teams.length; i++) {
        const team = this.teams[i]
        // should never happen
        if (team.previousFinish == 0 || team.previousFinish == '') { team.previousFinish = 1 }

        // TODO: allow league setting or weight - random, inverse of finish, weighted inverse of finish
        // the number of entries in lottery pool is determined by taking the square of the previous finish
        let num = 1
        console.log("Type", this.lotteryType);
        if (this.lotteryType == 'H') {
          num = team.previousFinish * team.previousFinish
        } else if (this.lotteryType == 'W') {
          num = team.previousFinish
        }

        for (let j = 0; j < num; j++) {
          pool.push(team)
        }
      }
      // console.log("pool", pool);
      let counter = 1
      while (pool.length > 0) {
        const index = this.getRandomInt(0, pool.length)
        const selectedTeam = pool[index]
        selectedTeam.draftOrder = counter++
        const data = {
          draftOrder: selectedTeam.draftOrder
        }
        firebase.database().ref('/users/' + user.uid + '/teams/' + selectedTeam.key).update(data)

        this.removeAllItemsForTeam(pool, selectedTeam)
      }

      this.$router.push('/league/' + this.$route.params.id + '/results')
    },
    getRandomInt (min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
    },
    removeAllItemsForTeam (pool, team) {
      for (let k = pool.length - 1; k >= 0; k--) {
        if (pool[k] == team) {
          pool.splice(k, 1)
        }
      }
    }
  }
}
</script>
