<template>
    <div>
      <h3>Time Left: {{ minutes }}:{{ seconds }}</h3>
    </div>
  </template>
  
  
  <script setup>

  defineProps(['initialTime']);
  defineEmits(['timerEnded']);
  
  
  let timeLeft = ref(initialTime);
  
  
  const minutes = computed(() => Math.floor(timeLeft.value / 60));
  const seconds = computed(() => timeLeft.value % 60);
  
  
  const countdown = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(countdown);
      emit('timerEnded');
    }
  }, 1000);
  
  
  onUnmounted(() => clearInterval(countdown));
  </script>