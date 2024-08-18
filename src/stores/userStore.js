import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: JSON.parse(localStorage.getItem('users')) || []
  }),
  actions: {
    addUser(user) {
      this.users.push(user)
      this.saveUsersToLocalStorage()
    },
    updateUser(index, updatedUser) {
      this.users[index] = updatedUser
      this.saveUsersToLocalStorage()
    },
    removeUser(index) {
      this.users.splice(index, 1)
      this.saveUsersToLocalStorage()
    },
    saveUsersToLocalStorage() {
      localStorage.setItem('users', JSON.stringify(this.users))
    }
  }
})

