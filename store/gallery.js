export const state = () => ({
  gallery: []
})

export const mutations = {
  INITIALGALLERY (state, payload) {
    state.gallery = payload
  },
  IMAGEUPLOADED (state, payload) {
    state.gallery.push(payload)
  }
}

export const getters = {
  getGallery (state) {
    return state.gallery
  }
}

export const actions = {
  initialGallery ({ commit }, payload ) {
    commit ('INITIALGALLERY', payload)

  },
  imageUploaded ({ commit}, payload) {
    commit('IMAGEUPLOADED', payload)
  }
}
