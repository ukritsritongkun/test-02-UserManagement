<template>
  <div class="container">
    <h1 class="title">User Management</h1>
    
    <button
      class="btn add-btn"
      :class="{'cancel-state': showAddForm}"
      @click="showAddForm = !showAddForm"
    >
      <i :class="showAddForm ? 'fas fa-times' : 'fas fa-plus'"></i>
      <span>{{ showAddForm ? 'Cancel' : 'Add User' }}</span>
    </button>
    
   <div v-if="showAddForm" class="form-container">
    <input 
      v-model="newUser.name" 
      placeholder="Name" 
      class="input" 
      :class="{'error': errors.name}"
    >
    <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
    
    <input 
      v-model="newUser.email" 
      placeholder="Email" 
      class="input" 
      :class="{'error': errors.email}"
    >
    <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
    
    <button 
      @click="addUser" 
      class="btn save-btn" 
      :disabled="hasErrors"
    >
      <i class="fas fa-save"></i>
      <span>Save</span>
    </button>
  </div>
    
    <ul class="user-list">
      <li v-for="(user, index) in users" :key="index" class="user-item">
        <div class="user-info">
          <span class="user-name">{{ user.name }}</span>
          <span class="user-email">{{ user.email }}</span>
        </div>
        <div class="user-actions">
          <button @click="editUser(index)" class="btn edit-btn">
            <i class="fas fa-edit"></i>
          </button>
          <button @click="openConfirmDelete(index)" class="btn delete-btn">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </li>
    </ul>
    
    <div v-if="showEditForm" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Edit User</h2>
      <div class="form-group">
        <label for="edit-name">Username</label>
        <input 
          id="edit-name" 
          v-model="editUserData.name" 
          placeholder="Username" 
          class="modal-input" 
          :class="{'error': errors.name}"
        >
        <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
      </div>
      <div class="form-group">
        <label for="edit-email">Email</label>
        <input 
          id="edit-email" 
          v-model="editUserData.email" 
          placeholder="Email" 
          class="modal-input" 
          :class="{'error': errors.email}"
        >
        <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
      </div>
      <div class="modal-button">
        <button 
          @click="updateUser" 
          class="btn save-btn" 
          :disabled="hasErrors"
        >
          <i class="fas fa-save"></i>
          <span>Save</span>
        </button>
        <button @click="closeModal" class="btn cancel-btn">
          <i class="fas fa-times"></i>
          <span>Cancel</span>
        </button>
      </div>
    </div> 
  </div>

   <div v-if="showConfirmDelete" class="modal-overlay" @click="closeConfirmDelete">
      <div class="modal-content" @click.stop>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this user?</p>
        <div class="modal-button">
          <button @click="confirmDelete" class="btn delete-btn">
            <span>Delete</span>
          </button>
          <button @click="closeConfirmDelete" class="btn cancel-btn">
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useUserStore } from './stores/userStore'

export default {
  setup() {
    const userStore = useUserStore()
    const showAddForm = ref(false)
    const showEditForm = ref(false)
    const showConfirmDelete = ref(false)
    const newUser = ref({ name: '', email: '' })
    const editUserData = ref({ name: '', email: '' })
    const editingIndex = ref(null)
    const deletingIndex = ref(null)
    const errors = ref({ name: null, email: null })

    const users = computed(() => userStore.users)

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    function validate(user) {
      errors.value.name = user.name ? null : 'Username is required.'
      errors.value.email = user.email 
        ? (emailPattern.test(user.email) ? null : 'Invalid email address.')
        : 'Email is required.'
    }

    function addUser() {
      validate(newUser.value)
      if (!hasErrors.value) {
        userStore.addUser({ ...newUser.value })
        newUser.value = { name: '', email: '' }
        showAddForm.value = false
      }
    }

    function editUser(index) {
      editingIndex.value = index
      editUserData.value = { ...userStore.users[index] }
      showEditForm.value = true
    }

    function updateUser() {
      validate(editUserData.value)
      if (!hasErrors.value) {
        userStore.updateUser(editingIndex.value, { ...editUserData.value })
        closeModal()
      }
    }

    function openConfirmDelete(index) {
      deletingIndex.value = index
      showConfirmDelete.value = true
    }

    function confirmDelete() {
      if (deletingIndex.value !== null) {
        userStore.removeUser(deletingIndex.value)
        deletingIndex.value = null
        showConfirmDelete.value = false
      }
    }

    function closeConfirmDelete() {
      showConfirmDelete.value = false
      deletingIndex.value = null
    }

    function closeModal() {
      showEditForm.value = false
    }

    const hasErrors = computed(() => errors.value.name || errors.value.email)

    watch(newUser, () => validate(newUser.value), { deep: true })
    watch(editUserData, () => validate(editUserData.value), { deep: true })

    return {
      users,
      showAddForm,
      showEditForm,
      showConfirmDelete,
      newUser,
      editUserData,
      addUser,
      editUser,
      updateUser,
      openConfirmDelete,
      confirmDelete,
      closeConfirmDelete,
      closeModal,
      errors,
      hasErrors
    }
  }
}

</script>

<style>
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.btn i {
  margin-right: 8px;
}

.btn span {
  display: inline-block;
  font-weight: bold;
}

.add-btn {
  background-color: #28a745;
  color: white;
  width: 100%;
}

.add-btn.cancel-state {
  background-color: #6c757d;
}

.save-btn {
  background-color: #007bff;
  color: white;
}

.edit-btn {
  background-color: #ffc107;
  color: white;
}

.edit-btn i {
  margin-right: -2px;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  margin-left: 10px;
}

.delete-btn i{
  margin-right: -2px;
}

.form-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.input {
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-list {
  list-style: none;
  padding: 0;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: bold;
  color: #333;
}

.user-email {
  color: #777;
}

.modal-overlay {
  font-family: 'Arial', sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-input {
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width:90%;
}

.modal-button{
  margin-top: 10px;
  display: flex;
  justify-content: right;
  align-items: center;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  margin-left: 10px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.error {
  border-color: red;
}

.error-msg {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
