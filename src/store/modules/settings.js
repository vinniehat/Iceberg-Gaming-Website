import * as firebase from 'firebase/app'
import 'firebase/auth'
import axios from "axios";
import store from '../store';
import router from "@/router/router";
const utils = require("../../../utils");
axios.defaults.headers = {
  'Content-Type': 'application/json'
}
const state = {
  loas: null
}
const getters = {
  isUserOnLOA: (state) => (userID) => {
    let loas = state.loas.filter(loa => loa.userID === userID);
    if(loas[0]) { // Check if at least one row exists in the array
      return loas[loas.length - 1].isDeleted === 0; // 0 means active, 1 means inactive
    } else {
      return false;
    }

  },
  loas: (state) => {
    return state.loas;
  },
  LOAsFromUser: (state) => (userID) => {
    return state.loas.filter(loa => loa.userID === userID);
  },
  mostRecentLOA: (state) => (userID) => {
    let loas = state.loas.filter(loa => loa.userID === userID);
    return loas[loas.length-1];
  }
}
const actions = {
// LOAS

  async submitLOA(context, [end_date, reason]) {
    const accessToken = await store.getters.currentUser.accessToken;
    await axios.post(`${utils.base_url}/settings/loa/submit`, {
      accessToken,
      endDate: end_date,
      reason
    }).then(async () => {
        await context.dispatch("fetchLOAs");
    }).catch(error => {
      if(error) {
        utils.alertGeneral()
      }
    })
  },
  async endLOA({dispatch, rootGetters}, [userID, loaID]) { // Allows admins to end another user's LOA
    await axios.post(`${utils.base_url}/settings/loa/end`, {
      accessToken: await rootGetters.currentUser.accessToken,
      userID,
      loaID
    }).then(async () => {
      await dispatch("fetchLOAs");
    }).catch(error => {
      if(error) {
        utils.alertGeneral()
      }
    })
  },
  async changeUsername({dispatch, rootGetters}, [username, userID]) {
    await axios.post(`${utils.base_url}/settings/username`, {
      accessToken: await rootGetters.currentUser.accessToken,
      userID,
      username
    }).then(async () => {
      await dispatch("fetchCurrentUser");
      if(userID !== rootGetters.currentUser.id) { // To prevent too many queries ~ Meaning an admin ran this function.
        await dispatch("fetchUsers");
      }
    }).catch(error => {
      if(error) {
        utils.alertGeneral()
      }
    })
  },
  async changeDiscord({dispatch, rootGetters}, [discord, userID]) {
    await axios.post(`${utils.base_url}/settings/discord`, {
      accessToken: await rootGetters.currentUser.accessToken,
      userID,
      discord
    }).then(async () => {
      await dispatch("fetchCurrentUser");
      if(userID !== rootGetters.currentUser.id) { // To prevent too many queries ~ Meaning an admin ran this function.
        await dispatch("fetchUsers");
      }
    }).catch(error => {
      if(error) {
        utils.alertGeneral()
      }
    })
  }, async changeStatus({dispatch, rootGetters}, [status, userID]) {
    await axios.post(`${utils.base_url}/settings/status`, {
      accessToken: await rootGetters.currentUser.accessToken,
      userID,
      status
    }).then(async () => {
      await dispatch("fetchCurrentUser");
      if(userID !== rootGetters.currentUser.id) { // To prevent too many queries ~ Meaning an admin ran this function.
        await dispatch("fetchUsers");
      }
    }).catch(error => {
      if(error) {
        utils.alertGeneral()
      }
    })
  }, async changeIsEmailPublic(context, newIsEmailPublic) {
    await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
      isEmailPublic: newIsEmailPublic
    }).then(async () => {
      utils.logger.log({
        level: "info",
        message: "User changed isEmailPublic",
        newIsEmailPublic,
        userID: firebase.auth().currentUser.uid,
        isLoggedIn: true
      })
    }).catch(error => {
      if (error) {
        utils.logger.log({
          level: "error",
          newIsEmailPublic,
          userID: firebase.auth().currentUser.uid,
          isLoggedIn: true,
          message: error.message,
          stack: error.stack,
        })
        utils.alertGeneral();
      }
    })
    await context.dispatch("fetchCurrentUser");
  },
  async fetchLOAs({commit, rootGetters}) {
    if(!rootGetters.currentUser) return;
    axios.post(`${utils.base_url}/settings/loas`, {accessToken: await rootGetters.currentUser.accessToken}).then(response => {
      commit('setLOAs', response.data);
    })
  },
  async deleteAccount({commit, rootGetters}, [userID]) {
    if(!rootGetters.currentUser) return;
    axios.post(`${utils.base_url}/settings/delete_account`, {accessToken: await rootGetters.currentUser.accessToken, userID}).then(response => {
      localStorage.removeItem('refreshToken');
      commit('logoutUser');
      router.push('/').catch(()=>{});
    }).catch(error => {
      if(error) utils.alertGeneral();
    })
  }
}
const mutations = {
  setLOAs(state, loas) {
    state.loas = loas;
  }
}

export default {
  getters, actions, mutations, state
}
