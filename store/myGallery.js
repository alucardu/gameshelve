export const state = () => ({
  myGallery: []
})

export const mutations = {
  INITIALGALLERY (state, payload) {
    state.myGallery = payload
  },
  IMAGEADDED (state, payload) {
    state.myGallery.push(payload)
  }
}

export const getters = {
  getGallery (state) {
    return state.myGallery
  }
}

export const actions = {
  initialGallery ({ commit }, payload ) {
    commit ('INITIALGALLERY', payload)

  },
  imageAdded ({ commit}, payload) {
    commit('IMAGEADDED', payload)
  }
}
