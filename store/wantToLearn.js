export const state = () => ({
  myGallery: []
})

export const mutations = {
  INITIALGALLERY (state, payload) {
    state.myGallery = payload
  },
  IMAGEADDED (state, payload) {
    state.myGallery.push(payload)
  },
  IMAGEREMOVED (state, payload) {
    state.myGallery = payload
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
  },
  imageRemoved ({ commit }, payload) {
    commit('IMAGEREMOVED', payload)
  }
}
