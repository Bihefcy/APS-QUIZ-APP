<template>
  <div class="min-h-screen w-full bg-gray-50">
    <nav class="bg-white shadow mb-4">
      <div class="container mx-auto px-4">
        <div class="flex space-x-4 h-16 items-center">
          <router-link 
            to="/admin" 
            class="text-gray-700 hover:text-gray-900"
          >
            Admin
          </router-link>
          <router-link 
            to="/quiz" 
            class="text-gray-700 hover:text-gray-900"
          >
            Quiz
          </router-link>
          <router-link 
            to="/time-challenge" 
            class="text-gray-700 hover:text-gray-900"
          >
            Time Challenge
          </router-link>
        </div>
      </div>
    </nav>

    <main class="container mx-auto w-full px-4">
      <router-view></router-view>
    </main>
  </div>
</template>