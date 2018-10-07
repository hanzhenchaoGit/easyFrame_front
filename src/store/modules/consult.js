const consult = {
  state: {
    showEditWindow: false
  },
  mutations: {
    SET_SHOWEDIT: (state, show) => {
      state.showEditWindow = show
    }
  },
  actions: {
    setShowEditWindow({ commit }, show) {
      commit('SET_SHOWEDIT', show)
    }
  }
}

export default consult
