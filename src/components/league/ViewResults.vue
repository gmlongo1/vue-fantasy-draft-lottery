<template>
  <v-container>
    <v-layout row>
      <v-col xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar class="secondary">
            <v-toolbar-title class="white--text">{{ name }}</v-toolbar-title>
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
                      <template v-for="(team, index) in teams">
                        <v-list-item v-bind:key="team.name" class="list-item px-0 px-md-4">
                          <v-list-item-avatar :color="colors[index]">
                            <span class="icon white--text">{{ team.draftOrder }}</span>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>{{ team.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ team.owner }} &lt;{{ team.email }}&gt;</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider v-if="index + 1 < teams.length" v-bind:key="team.name + '-divider'"></v-divider>
                      </template>
                    </transition-group>
                  </v-list>
                </v-col>
              </v-layout>
              <v-divider></v-divider>
              <v-layout row mt-2>
                <v-col>
                  <v-btn @click="onCancel()" class="mr-4">Cancel</v-btn>
                  <v-btn class="red accent-4" dark @click="onEmailResults()"><v-icon left>mdi-email</v-icon>Email Results</v-btn>
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
      teams: [],
      colors
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
    let t = [];

    teamsRef.once('value',
      snapshot => {
        snapshot.forEach((childSnapshot) => {
          var childKey = childSnapshot.key;
          var val = childSnapshot.val();
          t.push({
            key: childKey,
            name: val.name,
            email: val.email,
            owner: val.owner,
            draftOrder: val.draftOrder,
            previousFinish: val.previousFinish
          });

          return false;
        });

        t.sort(
          (a, b) => {
            if (a.draftOrder < b.draftOrder)
              return -1
            if (a.draftOrder > b.draftOrder)
              return 1
            return 0
          }
        )
      });

      let index = 0;
      let interval = setInterval(() => {
        if (this.teams.length == t.length) {
          clearInterval(interval);
        } else
          this.teams.push(t[index++]);
      }, 1000);
  },
  methods: {
    onCancel () {
      this.$router.push('/league/' + this.$route.params.id)
    },
    onEmailResults () {
      let recipients = "";
      let subject = this.name + " " + this.season + " Draft Order";
      let body = this.name + " " + this.season + " draft order: " + escape('\r\n') + escape('\r\n');

      for (let i = 0; i < this.teams.length; i++) {
        const team = this.teams[i];
        if (i > 0)
          recipients += ",";
        recipients += team.email;

        body += (i + 1) + ".  " + team.name + escape('\r\n');
      }

      body += escape('\r\n') + "Generated by Fantasy Draft Lottery " + this.season + " on " + new Date();
      
      console.log("Recipients", recipients);
      console.log("Subject", subject);
      console.log("Body", body);

      let emailLink = "mailto:" + recipients + "?subject=" + subject + "&body=" + body;
      console.log("Email Link", emailLink);

      location.href = emailLink;
    }
  }
}
</script>
