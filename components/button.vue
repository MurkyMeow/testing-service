<template>
  <button><slot/></button>
</template>
<style lang="scss" scoped>
button {
  font-weight: bold;
  letter-spacing: .25px;
  color: #fff;
  cursor: pointer;
  padding: 4px 15px;
  border: none;
  border-radius: 5px;
  background: #7542e5;
}
button:active {
  transform: translateY(2px);
}
</style>
